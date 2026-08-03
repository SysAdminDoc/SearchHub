const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'transfer helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__transfer = { buildEngineExportPayload, normalizeEngineExport };`,
  context,
  { filename: 'index.html' }
);

const { buildEngineExportPayload, normalizeEngineExport } = context.__transfer;
const payload = buildEngineExportPayload({
  Web: { engines: [{ name: 'One', url: 'https://one.test/{q}', desc: 'One' }] }
});
assert.deepEqual(JSON.parse(JSON.stringify(payload)), {
  schemaVersion: 1,
  categories: { Web: [{ name: 'One', url: 'https://one.test/{q}', desc: 'One' }] }
});

const normalized = normalizeEngineExport({
  schemaVersion: 1,
  categories: {
    Web: [
      { name: 'One', url: 'https://one.test', desc: '' },
      { name: 'Duplicate', url: 'https://one.test', desc: '' },
      { name: 'Bad', url: 'file:///not-an-engine', desc: '' }
    ]
  }
});
assert.deepEqual(JSON.parse(JSON.stringify(normalized.categories.Web)), [{ name: 'One', url: 'https://one.test', desc: '' }]);
assert.equal(normalizeEngineExport({ schemaVersion: 2, categories: {} }), null);

console.log('engine transfer tests passed');
