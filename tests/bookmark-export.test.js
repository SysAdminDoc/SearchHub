const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');
const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'session helpers must be defined before DOM bootstrap');
const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__session = { normalizeSearchSessionTargets, normalizeSearchSession };`,
  context,
  { filename: 'index.html' }
);

const { normalizeSearchSessionTargets, normalizeSearchSession } = context.__session;
assert.deepEqual(
  JSON.parse(JSON.stringify(normalizeSearchSessionTargets([
    { name: ' Google ', url: 'https://google.test/search' },
    { name: 'Bad', url: 'javascript:alert(1)' },
    { name: 'Bing', url: 'https://bing.test/search' }
  ]))),
  [{ name: 'Google', url: 'https://google.test/search' }, { name: 'Bing', url: 'https://bing.test/search' }]
);
assert.deepEqual(
  JSON.parse(JSON.stringify(normalizeSearchSession({ query: ' tornado ', targets: [{ name: 'Google', url: 'https://google.test' }] }))),
  { query: 'tornado', targets: [{ name: 'Google', url: 'https://google.test' }] }
);

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
assert.ok(manifest.permissions.includes('bookmarks'));
const background = fs.readFileSync('background.js', 'utf8');
assert.match(background, /chrome\.bookmarks\.create/);
assert.match(background, /message\?\.type !== 'export_session'/);
assert.match(background, /SearchHub - /);
new vm.Script(background, { filename: 'background.js' });

console.log('bookmark export tests passed');
