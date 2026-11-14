/* global penpot, DESIGN_SYNC_URL, shapeFields, flexFields */
const fields = (obj, keys) => Object.fromEntries(keys.map(key => [key, obj[key]]).filter(([, value]) => value !== undefined));
function describe(shape, root = false) {
  const value = fields(shape, shapeFields);
  if (root) {
    delete value.parentX;
    delete value.parentY;
  }
  if (shape.flex) value.flex = fields(shape.flex, flexFields);
  if (shape.children) value.children = shape.children.map(child => describe(child));
  return value;
}

const images = new Map();
let timer, generation = 0, sending = false;
let fileIds = new Map();

async function collect(fileId, ticket) {
  if (sending) {
    timer = setTimeout(() => collect(fileId, ticket), 250);
    return;
  }
  const file = penpot.currentFile;
  const ids = fileIds.get(fileId);
  if (ticket !== generation || file?.id !== fileId || !ids) return;
  sending = true;
  try {
    const library = penpot.library.local;
    const tokens = (library.tokens?.sets ?? []).map(set => ({
      ...fields(set, ['name', 'active']),
      tokens: set.tokens.map(token => fields(token, ['name', 'type', 'value'])),
    }));
    const boards = [];
    for (const id of ids) {
      const shape = file.pages.map(page => page.getShapeById(id)).find(Boolean);
      if (shape?.type !== 'board') throw new Error('A mapped board is missing');
      const tree = JSON.parse(JSON.stringify(describe(shape, true)));
      const key = JSON.stringify([tree, tokens]);
      if (images.get(id)?.key !== key) {
        const bytes = await shape.export({ type: 'png', scale: 1 });
        images.set(id, { key, bytes });
      }
      boards.push({ id, tree, bytes: images.get(id).bytes });
    }
    if (ticket !== generation || penpot.currentFile?.id !== fileId) return;
    penpot.ui.sendMessage({ type: 'snapshot', fileId, boards, tokens });
  } catch {
    penpot.ui.sendMessage({ type: 'error', text: 'Snapshot failed. Check the mapped boards and plugin permissions.' });
  } finally {
    sending = false;
  }
}

penpot.ui.open('Design Sync', DESIGN_SYNC_URL + '/panel', { width: 360, height: 180 });
penpot.ui.onMessage(message => {
  if (message?.type === 'configure') {
    fileIds = new Map(Object.entries(message.files));
    images.clear();
  }
});
penpot.on('contentsave', () => {
  clearTimeout(timer);
  const ticket = ++generation;
  const fileId = penpot.currentFile?.id;
  if (fileIds.has(fileId)) timer = setTimeout(() => collect(fileId, ticket), 5000);
});
