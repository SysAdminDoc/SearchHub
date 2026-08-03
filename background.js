const SEARCHHUB_DEFAULT_ENGINES = 'google,bing,ddg';

function buildSearchHubURL(query) {
  const url = new URL(chrome.runtime.getURL('index.html'));
  url.search = '?q=' + encodeURIComponent((query || '').trim()) + '&e=' + SEARCHHUB_DEFAULT_ENGINES;
  return url.toString();
}

function openSearchHub(query, disposition) {
  const url = buildSearchHubURL(query);
  if (disposition === 'currentTab') {
    chrome.tabs.update({ url });
    return;
  }
  chrome.tabs.create({ url, active: disposition !== 'newBackgroundTab' });
}

function normalizeSessionTargets(value) {
  if (!Array.isArray(value)) return [];
  return value.map(target => {
    const name = typeof target?.name === 'string' ? target.name.trim().slice(0, 120) : '';
    const url = typeof target?.url === 'string' ? target.url.trim().slice(0, 2000) : '';
    return name && /^https?:\/\//i.test(url) ? { name, url } : null;
  }).filter(Boolean).slice(0, 100);
}

function createBookmark(parentId, title, url) {
  return new Promise((resolve, reject) => {
    const details = { title };
    if (parentId) details.parentId = parentId;
    if (url) details.url = url;
    chrome.bookmarks.create(details, node => {
      const error = chrome.runtime.lastError;
      if (error) reject(new Error(error.message));
      else resolve(node);
    });
  });
}

async function exportSearchSession(message, sendResponse) {
  const query = typeof message.query === 'string' ? message.query.trim().slice(0, 500) : '';
  const targets = normalizeSessionTargets(message.targets);
  if (!targets.length) { sendResponse({ ok: false, error: 'No valid search targets to export' }); return; }
  try {
    const folder = await createBookmark('', 'SearchHub - ' + (query || 'Search session'));
    await Promise.all(targets.map(target => createBookmark(folder.id, target.name, target.url)));
    sendResponse({ ok: true, count: targets.length });
  } catch { sendResponse({ ok: false, error: 'Could not create the bookmark folder' }); }
}

chrome.omnibox.onInputEntered.addListener((text, disposition) => openSearchHub(text, disposition));
chrome.action.onClicked.addListener(() => openSearchHub('', 'newForegroundTab'));
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'export_session') return false;
  exportSearchSession(message, sendResponse);
  return true;
});
