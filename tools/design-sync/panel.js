const form = document.querySelector('form');
const status = document.querySelector('[role=status]');
let token, pending, uploading = false;

function request(path, options = {}) {
  return fetch(path, { ...options, headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } });
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  token = form.elements.token.value.trim();
  try {
    const result = await request('/files');
    if (!result.ok) throw new Error();
    parent.postMessage({ type: 'configure', files: await result.json() }, PENPOT_ORIGIN);
    form.reset();
    form.hidden = true;
    status.textContent = 'Connected. Leave this panel open while editing.';
  } catch {
    status.textContent = 'Connection failed. Check the current session token.';
  }
});

window.addEventListener('message', async event => {
  if (event.source !== parent || event.origin !== PENPOT_ORIGIN || !token) return;
  if (event.data?.type === 'error') status.textContent = event.data.text;
  if (event.data?.type !== 'snapshot') return;
  pending = event.data;
  if (uploading) return;
  uploading = true;
  while (pending) {
    const snapshot = pending;
    pending = undefined;
    await upload(snapshot);
  }
  uploading = false;
});

async function upload({ fileId, boards, tokens }) {
  try {
    const body = JSON.stringify({
      fileId, tokens, boards: await Promise.all(boards.map(async ({ id, tree, bytes }) => ({
        id, tree, png: await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(new Blob([bytes], { type: 'image/png' }));
        }),
      }))),
    });
    const result = await request('/snapshot', { method: 'POST', body });
    status.textContent = result.ok ? 'Snapshot received.' : 'Snapshot rejected (' + result.status + ').';
  } catch {
    status.textContent = 'Snapshot delivery failed. Check the local listener.';
  }
}
