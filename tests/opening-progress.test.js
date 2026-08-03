const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'opening progress helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__progress = { getOpeningProgressState };`,
  context,
  { filename: 'index.html' }
);

const { getOpeningProgressState } = context.__progress;
assert.deepEqual(
  JSON.parse(JSON.stringify(getOpeningProgressState(5, 12, 4, 1))),
  { completed: 5, total: 12, launched: 4, blocked: 1, percent: 42 }
);
assert.deepEqual(
  JSON.parse(JSON.stringify(getOpeningProgressState(99, 3, -4, '2'))),
  { completed: 3, total: 3, launched: 0, blocked: 2, percent: 100 }
);
assert.deepEqual(
  JSON.parse(JSON.stringify(getOpeningProgressState(0, 0, 0, 0))),
  { completed: 0, total: 0, launched: 0, blocked: 0, percent: 0 }
);

console.log('opening progress tests passed');
