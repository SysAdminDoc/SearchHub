const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'bookmarklet helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__bookmarklet = { buildBookmarkletURL };`,
  context,
  { filename: 'index.html' }
);

const { buildBookmarkletURL } = context.__bookmarklet;
const bookmarklet = buildBookmarkletURL('https://example.test/searchhub/index.html?old=1#old');
assert.match(bookmarklet, /^javascript:/);
assert.match(bookmarklet, /window\.getSelection/);
assert.match(bookmarklet, /document\.title/);
assert.match(bookmarklet, /e=google,bing,ddg/);
assert.doesNotMatch(bookmarklet, /old=1|#old/);

console.log('bookmarklet tests passed');
