const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'editor helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__editor = { normalizeCustomEngine, normalizeEngineOverlay, applyEngineOverlay };`,
  context,
  { filename: 'index.html' }
);

const { normalizeCustomEngine, normalizeEngineOverlay, applyEngineOverlay } = context.__editor;
assert.deepEqual(JSON.parse(JSON.stringify(normalizeCustomEngine({
  name: ' Custom ',
  url: 'https://example.test/search?q=',
  desc: ' Test engine '
}))), { name: 'Custom', url: 'https://example.test/search?q=', desc: 'Test engine' });
assert.equal(normalizeCustomEngine({ name: 'Missing URL', url: 'ftp://example.test' }), null);

const overlay = normalizeEngineOverlay({
  version: 1,
  added: { Web: [{ name: 'Added', url: 'https://added.test/{q}', desc: '' }, { name: 'Bad', url: 'not-a-url' }] },
  removed: { Web: ['https://one.test'] },
  order: { Web: ['https://added.test/{q}', 'https://two.test'] }
});
const active = applyEngineOverlay({
  Web: { engines: [
    { name: 'One', url: 'https://one.test', desc: '' },
    { name: 'Two', url: 'https://two.test', desc: '' }
  ] }
}, overlay);

assert.deepEqual(JSON.parse(JSON.stringify(active.Web.engines.map(engine => engine.name))), ['Added', 'Two']);

console.log('engine editor tests passed');
