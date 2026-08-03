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

chrome.omnibox.onInputEntered.addListener((text, disposition) => openSearchHub(text, disposition));
chrome.action.onClicked.addListener(() => openSearchHub('', 'newForegroundTab'));
