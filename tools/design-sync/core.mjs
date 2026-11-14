import { createHash, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';
import { readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const bodyLimit = 24 * 1024 * 1024;
export const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
const ui = 'app/src/main/java/com/example/androidstockapp/';
export const uiPath = path => /^(AccountScreen|LandingScreen|MainActivity|MarketScreens|PriceChart|PulseTheme)\.kt$/.test(path.slice(ui.length)) && path.startsWith(ui)
  || /^app\/src\/main\/res\/(?:drawable\/ic_[a-z_]+|values\/(?:strings|themes))\.xml$/.test(path);
export const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export const digest = value => createHash('sha256').update(value).digest('hex');
export const stable = value => JSON.stringify(value, (_, item) => object(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);

export function authorized(header, token) {
  const received = Buffer.from(header ?? '');
  const expected = Buffer.from('Bearer ' + token);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export const shapeFields = 'id type name parentX parentY width height hidden opacity rotation flipX flipY blendMode clipContent borderRadius borderRadiusTopLeft borderRadiusTopRight borderRadiusBottomLeft borderRadiusBottomRight fills strokes shadows blur backgroundBlur characters fontFamily fontSize fontWeight fontStyle lineHeight letterSpacing align verticalAlign textTransform textDecoration growType tokens content d image horizontalSizing verticalSizing'.split(' ');
export const flexFields = 'dir alignItems alignContent justifyItems justifyContent wrap rowGap columnGap topPadding rightPadding bottomPadding leftPadding horizontalPadding verticalPadding paddingType horizontalSizing verticalSizing'.split(' ');

const shapeKeys = new Set([...shapeFields, 'children', 'flex']);
const flexKeys = new Set(flexFields);
const safeValue = (value, depth = 0) => {
  if (depth > 8) return false;
  if (value === null || typeof value === 'boolean') return true;
  if (typeof value === 'string') return value.length <= 80_000;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.length <= 2000 && value.every(item => safeValue(item, depth + 1));
  return object(value) && Object.keys(value).length <= 100 && Object.entries(value).every(([key, item]) =>
    key.length <= 100 && !['__proto__', 'prototype', 'constructor'].includes(key) && safeValue(item, depth + 1));
};
const only = (value, names) => object(value) && Object.keys(value).every(key => names.includes(key));
const boundedText = value => typeof value === 'string' && value.length <= 256;
const validTokens = sets => Array.isArray(sets) && sets.length <= 100 && sets.every(set =>
  only(set, ['name', 'active', 'tokens']) && boundedText(set.name) && typeof set.active === 'boolean'
  && Array.isArray(set.tokens) && set.tokens.length <= 1000 && set.tokens.every(token =>
    only(token, ['name', 'type', 'value']) && boundedText(token.name) && boundedText(token.type)
    && safeValue(token.value)));

function validTree(tree, ids, depth = 0) {
  if (!object(tree) || !uuid.test(tree.id) || ids.has(tree.id) || !boundedText(tree.name)
      || !boundedText(tree.type) || depth > 35 || ids.size >= 5000) return false;
  ids.add(tree.id);
  return Object.entries(tree).every(([key, value]) => {
    if (!shapeKeys.has(key)) return false;
    if (key === 'children') return Array.isArray(value) && value.every(child => validTree(child, ids, depth + 1));
    if (key === 'flex') return object(value) && Object.entries(value).every(([k, v]) => flexKeys.has(k) && safeValue(v));
    return safeValue(value);
  });
}

export function mappingPaths(files) {
  const owners = new Map();
  for (const [fileId, boards] of Object.entries(files)) {
    if (!uuid.test(fileId) || !object(boards) || !Object.keys(boards).length) throw new Error('invalid-file-mapping');
    for (const [boardId, paths] of Object.entries(boards)) {
      if (!uuid.test(boardId) || !Array.isArray(paths) || !paths.length
          || !paths.every(path => typeof path === 'string' && uiPath(path))) throw new Error('invalid-board-mapping');
      for (const path of paths) {
        if (owners.has(path) && owners.get(path) !== fileId) throw new Error('overlapping-file-mappings');
        owners.set(path, fileId);
      }
    }
  }
  return new Set(owners.keys());
}

export function affectedScope(changedIds, mapping) {
  const boards = new Set(changedIds);
  const paths = new Set(changedIds.flatMap(id => mapping[id]));
  let expanded;
  do {
    expanded = false;
    for (const [id, mapped] of Object.entries(mapping)) {
      if (boards.has(id) || !mapped.some(path => paths.has(path))) continue;
      boards.add(id);
      for (const path of mapped) paths.add(path);
      expanded = true;
    }
  } while (expanded);
  return { boards: [...boards], paths: [...paths] };
}

export function snapshot(value, files) {
  if (!only(value, ['fileId', 'tokens', 'boards']) || !uuid.test(value.fileId) || !Object.hasOwn(files, value.fileId) || !validTokens(value.tokens)
      || !Array.isArray(value.boards)) throw new Error('Invalid snapshot');
  const mapping = files[value.fileId];
  const boards = [...value.boards];
  const ids = new Set();
  if (boards.length !== Object.keys(mapping).length) throw new Error('Invalid board count');
  for (const board of boards) {
    if (!only(board, ['id', 'tree', 'png']) || !uuid.test(board.id) || !Object.hasOwn(mapping, board.id)
        || !validTree(board.tree, ids) || board.tree.type !== 'board' || board.id !== board.tree.id
        || typeof board.png !== 'string' || board.png.length > 8 * 1024 * 1024) throw new Error('Invalid board');
    const png = Buffer.from(board.png, 'base64');
    if (png.toString('base64') !== board.png || png.length < 33
        || png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a'
        || png.toString('ascii', 12, 16) !== 'IHDR'
        || [png.readUInt32BE(16), png.readUInt32BE(20)].some(size => size < 1 || size > 8192)) throw new Error('Invalid PNG');
    board.png = png;
  }
  boards.sort((a, b) => a.id.localeCompare(b.id));
  const structure = { fileId: value.fileId, tokens: value.tokens,
    boards: boards.map(({ id, tree, png }) => ({ id, tree, pngHash: digest(png) })) };
  const normalized = stable(structure);
  if (Buffer.byteLength(normalized) > 512 * 1024) throw new RangeError('Design structure too large');
  return { hash: digest(normalized), structure, boards };
}

export async function readRequest(req, limit = bodyLimit) {
  const chunks = [];
  let length = 0;
  for await (const chunk of req.iterator({ destroyOnReturn: false })) {
    length += chunk.length;
    if (length > limit) {
      req.resume();
      throw new RangeError('Request too large');
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export function latestQueue(run, { quiet = 0, paused = false, error = () => {} } = {}) {
  let pending, active, timer, stopped = false;
  const release = () => {
    timer = undefined;
    if (!pending || active || stopped || paused) return;
    const item = pending;
    pending = undefined;
    active = Promise.resolve().then(() => run(item)).catch(error).finally(() => {
      active = undefined;
      if (!timer) release();
    });
  };
  return {
    push(item) {
      if (stopped) return;
      pending = item;
      clearTimeout(timer);
      timer = setTimeout(release, quiet);
    },
    pause() { paused = true; },
    resume() {
      paused = false;
      if (!timer) release();
    },
    status: () => ({ pending: pending?.hash ?? null, running: Boolean(active), paused }),
    async stop() {
      stopped = true;
      clearTimeout(timer);
      pending = undefined;
      await active;
    },
  };
}

export function takeSlot(times, now = Date.now()) {
  const recent = times.filter(time => time > now - 3600_000);
  if (recent.length >= 10) throw new Error('rate-cap');
  return [...recent, now];
}

export const repositoryRuntime = (tmp, commonGitDir, uid) =>
  join(tmp, 'androidstockapp-design-sync-' + uid + '-' + digest(commonGitDir).slice(0, 16));

export async function writeJson(path, value) {
  const temporary = path + '.tmp';
  await writeFile(temporary, JSON.stringify(value, null, 2), { mode: 0o600 });
  await rename(temporary, path);
}

export async function recordAttempt(ledger, now) {
  const times = await readFile(ledger, 'utf8').then(JSON.parse, error => {
    if (error.code !== 'ENOENT') throw error;
    return [];
  });
  const updated = takeSlot(times, now);
  await writeJson(ledger, updated);
  return updated;
}

export function ensureFingerprint(actual, expected) {
  if (actual !== expected) throw new Error('manual-worktree-conflict');
}

export function resumeState(state) {
  if (state.phase === 'running') return { ...state, phase: 'halted', reason: 'interrupted-run' };
  return state;
}

export async function buildWithRepair(build, repair) {
  let result = await build();
  if (!result.ok) {
    await repair(result);
    result = await build();
  }
  return result;
}

export function command(executable, args, { cwd, input, timeout = 60_000, signal, binary = false } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error('stopped'));
    const child = spawn(executable, args, { cwd, detached: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let output = '', stopReason, truncated = false;
    const bytes = [];
    let size = 0;
    const kill = reason => {
      stopReason = reason;
      try { process.kill(-child.pid, 'SIGKILL'); } catch {}
    };
    const stop = () => kill('stopped');
    const timer = setTimeout(() => kill('timeout'), timeout);
    signal?.addEventListener('abort', stop, { once: true });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
    if (binary) {
      child.stdout.on('data', chunk => {
        size += chunk.length;
        if (size > bodyLimit) kill('output-too-large');
        else bytes.push(chunk);
      });
      child.stderr.resume();
    } else {
      for (const stream of [child.stdout, child.stderr]) {
        stream.setEncoding('utf8');
        stream.on('data', chunk => {
          output += chunk;
          truncated ||= output.length > 256 * 1024;
          output = output.slice(-256 * 1024);
        });
      }
    }
    child.once('error', () => reject(new Error('command-start-failed')));
    child.once('close', code => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', stop);
      if (stopReason) reject(new Error(stopReason));
      else resolve({ ok: code === 0, output: binary ? Buffer.concat(bytes) : output, truncated });
    });
  });
}
