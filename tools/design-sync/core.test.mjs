import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import test from 'node:test';
import { crc32, deflateSync } from 'node:zlib';
import { setTimeout as delay } from 'node:timers/promises';
import { affectedScope, authorized, buildWithRepair, captureWithFingerprint, command, ensureFingerprint, latestQueue,
  mappingPaths, readRequest, recordAttempt, repositoryRuntime, resumeState, snapshot, stable, takeSlot, uiPath, waitForEmulator } from './core.mjs';

const fileId = '224cc244-cd3c-4c88-aea0-532883240284';
const id = 'd075f952-0d8c-4b6e-9b29-10373c7a4dc5';
const chunk = (type, data) => {
  const result = Buffer.alloc(data.length + 12);
  result.writeUInt32BE(data.length);
  result.write(type, 4);
  data.copy(result, 8);
  result.writeUInt32BE(crc32(result.subarray(4, -4)), result.length - 4);
  return result;
};
const header = Buffer.from('00000001000000010806000000', 'hex');
const makePng = data => Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header),
  chunk('IDAT', data), chunk('IEND', Buffer.alloc(0))]);
const png = makePng(deflateSync(Buffer.from([0, 0, 0, 0, 255]))).toString('base64');
const path = 'app/src/main/java/com/example/androidstockapp/PulseTheme.kt';
const mapping = { [fileId]: { [id]: [path] } };
const sample = () => ({ fileId, tokens: [{ name: 'Pulse', active: true, tokens: [{ name: 'Surface', type: 'color', value: '#111111' }] }],
  boards: [{ id, png, tree: { id, name: 'Demo', type: 'board', width: 360 } }] });

test('exact bearer auth, byte bound, allowed file, board, schema and UI path', async () => {
  assert.ok(authorized('Bearer 0123', '0123'));
  assert.ok(!authorized('Bearer 0124', '0123'));
  assert.ok(!authorized(undefined, '0123'));
  const stream = (...parts) => Readable.from(parts.map(part => Buffer.from(part)));
  assert.equal(await readRequest(stream('a', 'b'), 2), 'ab');
  await assert.rejects(readRequest(stream('aa', 'bb'), 3), RangeError);
  assert.ok(uiPath(path));
  assert.ok(!uiPath('app/src/main/res/../../src/main/res/drawable/ic_back.xml'));
  assert.ok(!uiPath('/' + path));
  assert.ok(!uiPath(path.replace('PulseTheme', 'DemoMarket')));
  assert.throws(() => snapshot({ ...sample(), fileId: '00000000-0000-0000-0000-000000000000' }, mapping));
  assert.throws(() => snapshot({ ...sample(), boards: [sample().boards[0], sample().boards[0]] }, mapping));
  assert.throws(() => snapshot({ ...sample(), tokens: null }, mapping));
  for (const patch of [{ id: '../exfiltrate' }, { png: 'YQ==' }, { tree: { ...sample().boards[0].tree, children: [{}] } }]) {
    assert.throws(() => snapshot({ ...sample(), boards: [{ ...sample().boards[0], ...patch }] }, mapping));
  }
  const token = sample().tokens[0].tokens[0];
  let tooDeep = 'bottom';
  for (let depth = 0; depth < 40; depth++) tooDeep = { nested: tooDeep };
  for (const badToken of [{ ...token, value: tooDeep }, { ...token, internal: true }, { ...token, type: 0 }]) {
    const bad = sample();
    bad.tokens[0].tokens[0] = badToken;
    assert.throws(() => snapshot(bad, mapping), /Invalid snapshot/);
  }
  for (const attribute of [{ unexpected: 'test' }, { fills: tooDeep }, { flex: { unexpected: true } }]) {
    const bad = sample();
    Object.assign(bad.boards[0].tree, attribute);
    assert.throws(() => snapshot(bad, mapping), /Invalid board/);
  }
  assert.throws(() => snapshot({ ...sample(), extra: tooDeep }, mapping), /Invalid snapshot/);
  assert.ok(snapshot(sample(), mapping).hash);
});

test('normalized hash ignores object field order and changes with design', () => {
  const original = snapshot(sample(), mapping);
  assert.equal(snapshot(JSON.parse(stable(sample())), mapping).hash, original.hash);
  const changed = sample();
  changed.boards[0].tree.width = 380;
  assert.notEqual(snapshot(changed, mapping).hash, original.hash);
});

test('quiet debounce then one active job and latest pending job', async () => {
  let finishFirst, startFirst, finishLast;
  const firstStarted = new Promise(resolve => { startFirst = resolve; });
  const lastFinished = new Promise(resolve => { finishLast = resolve; });
  const runs = [];
  const queue = latestQueue(async item => {
    runs.push(item.hash);
    if (item.hash === 'first') await new Promise(resolve => {
      finishFirst = resolve;
      startFirst();
    });
    else finishLast();
  }, { quiet: 5 });
  queue.push({ hash: 'previous' });
  queue.push({ hash: 'first' });
  await firstStarted;
  queue.push({ hash: 'intermediate' });
  queue.push({ hash: 'latest' });
  await delay(10);
  assert.deepEqual(runs, ['first']);
  assert.equal(queue.status().pending, 'latest');
  finishFirst();
  await lastFinished;
  await queue.stop();
  assert.deepEqual(runs, ['first', 'latest']);
  queue.push({ hash: 'ignored' });
  assert.deepEqual(queue.status(), { pending: null, running: false, paused: false });
});

test('ten attempts in a rolling hour, human worktree conflicts, interrupted restart', () => {
  const now = Date.now();
  let times = [];
  for (let i = 0; i < 10; i++) times = takeSlot(times, now);
  assert.throws(() => takeSlot(times, now), /rate-cap/);
  assert.deepEqual(takeSlot(times, now + 3600_000), [now + 3600_000]);
  ensureFingerprint('same', 'same');
  assert.throws(() => ensureFingerprint('human change', 'prior hash'), /manual-worktree-conflict/);
  assert.deepEqual(resumeState({ phase: 'running', times }), { phase: 'halted', reason: 'interrupted-run', times });
  assert.deepEqual(resumeState({ phase: 'ready', times }), { phase: 'ready', times });
});

test('scope follows shared UI files within one Penpot file and rejects cross-file overlap', () => {
  const otherFile = '224cc244-cd3c-4c88-aea0-532883240285';
  const market = 'd075f952-0d8c-4b6e-9b29-10373c7a4dc6';
  const detail = 'd075f952-0d8c-4b6e-9b29-10373c7a4dc7';
  const landing = 'd075f952-0d8c-4b6e-9b29-10373c7a4dc8';
  const marketPath = path.replace('PulseTheme', 'MarketScreens');
  const detailPath = path.replace('PulseTheme', 'PriceChart');
  const landingPath = path.replace('PulseTheme', 'LandingScreen');
  const boards = {
    [detail]: [marketPath, detailPath],
    [market]: [path, marketPath],
    [id]: [path],
    [landing]: [landingPath],
  };
  assert.throws(() => mappingPaths({ [fileId]: boards, [otherFile]: { [market]: [path] } }), /overlapping/);
  assert.deepEqual(mappingPaths({ [fileId]: boards }), new Set([marketPath, detailPath, path, landingPath]));
  const scope = affectedScope([id], boards);
  assert.deepEqual(new Set(scope.boards), new Set([id, market, detail]));
  assert.deepEqual(new Set(scope.paths), new Set([path, marketPath, detailPath]));
});

test('attempts are persistent and shared by worktrees of one repository', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'design-sync-slots-'));
  try {
    const repo = '/repos/project/.git';
    const canonical = repositoryRuntime(scratch, repo, 501);
    assert.notEqual(canonical, repositoryRuntime(scratch, '/repos/other/.git', 501));
    await mkdir(canonical);
    const ledger = join(canonical, 'attempts.json');
    const now = Date.now();
    for (let i = 0; i < 10; i++) await recordAttempt(ledger, now);
    const nextWorktreeLedger = join(repositoryRuntime(scratch, repo, 501), 'attempts.json');
    await assert.rejects(recordAttempt(nextWorktreeLedger, now), /rate-cap/);
    assert.deepEqual(await recordAttempt(nextWorktreeLedger, now + 3600_000), [now + 3600_000]);
  } finally {
    await rm(scratch, { recursive: true });
  }
});

test('memory-aware pause buffers the newest save until resume', async () => {
  const runs = [];
  const queue = latestQueue(async item => { runs.push(item.hash); }, { paused: true });
  queue.push({ hash: 'first' });
  queue.push({ hash: 'latest' });
  await delay(5);
  assert.deepEqual(queue.status(), { pending: 'latest', running: false, paused: true });
  queue.resume();
  await delay(5);
  queue.pause();
  queue.push({ hash: 'another' });
  await delay(5);
  assert.deepEqual(runs, ['latest']);
  assert.deepEqual(queue.status(), { pending: 'another', running: false, paused: true });
  await queue.stop();
});

test('one build repair and timeout terminates a real child', async () => {
  let builds = 0, repairs = 0;
  const failed = await buildWithRepair(async () => ({ ok: Boolean(++builds > 2) }), () => { repairs++; });
  assert.deepEqual([failed.ok, builds, repairs], [false, 2, 1]);
  const success = await buildWithRepair(async () => ({ ok: true }), () => { repairs++; });
  assert.deepEqual([success.ok, repairs], [true, 1]);
  await assert.rejects(command(process.execPath, ['-e', 'setInterval(() => {}, 10)'], { timeout: 20 }), /timeout/);
});

test('preview waits for Android boot even when the emulator console responds', async () => {
  let bootChecks = 0;
  const run = async (_, args) => args.includes('getprop')
    ? { ok: true, output: ++bootChecks === 1 ? '0\n' : '1\n' }
    : { ok: true, output: 'StockApp\nOK\n' };
  await waitForEmulator(run, 'adb', ['-s', 'emulator-5554']);
  assert.equal(bootChecks, 2, 'Installation must wait past the responsive-but-booting state');
  await assert.rejects(waitForEmulator(async () => ({ ok: false }), 'adb', [], AbortSignal.abort()), /abort/i);
});


test('rejects truncated, CRC-corrupt and invalid compressed PNG data', () => {
  const valid = Buffer.from(png, 'base64');
  const corrupt = Buffer.from(valid);
  corrupt[45] ^= 1;
  for (const bytes of [valid.subarray(0, -1), corrupt, makePng(Buffer.from('invalid'))]) {
    const value = sample();
    value.boards[0].png = bytes.toString('base64');
    assert.throws(() => snapshot(value, mapping), /Invalid PNG/);
  }
});

test('rejects malformed palettes and non-ASCII chunk names', () => {
  const valid = Buffer.from(png, 'base64');
  const palette = chunk('PLTE', Buffer.from([0, 0, 0]));
  const highBit = chunk('tEXt', Buffer.alloc(0));
  highBit[4] |= 0x80;
  highBit.writeUInt32BE(crc32(highBit.subarray(4, -4)), highBit.length - 4);
  const withChunks = (...chunks) => Buffer.concat([valid.subarray(0, 33), ...chunks, valid.subarray(33)]);
  const accepted = sample();
  accepted.boards[0].png = withChunks(palette).toString('base64');
  assert.ok(snapshot(accepted, mapping).hash);
  for (const bytes of [withChunks(chunk('PLTE', Buffer.alloc(0))),
    withChunks(chunk('PLTE', Buffer.alloc(4))), withChunks(chunk('PLTE', Buffer.alloc(771))),
    withChunks(palette, palette), withChunks(highBit)]) {
    const value = sample();
    value.boards[0].png = bytes.toString('base64');
    assert.throws(() => snapshot(value, mapping), /Invalid PNG/);
  }
});

test('manual edits during emulator wait or capture prevent completion', async () => {
  for (const stage of ['wait', 'capture']) {
    let fingerprint = 'built', captured = false;
    const check = async () => ensureFingerprint(fingerprint, 'built');
    await assert.rejects(captureWithFingerprint(check,
      async () => { if (stage === 'wait') fingerprint = 'edited'; },
      async () => { captured = true; if (stage === 'capture') fingerprint = 'edited'; }), /manual-worktree-conflict/);
    assert.equal(captured, stage === 'capture');
  }
});
