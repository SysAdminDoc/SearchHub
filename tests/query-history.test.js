const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'history helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__history = { normalizeHistoryEntries, addHistoryEntry };`,
  context,
  { filename: 'index.html' }
);

const { normalizeHistoryEntries, addHistoryEntry } = context.__history;

const normalized = normalizeHistoryEntries([
  { query: '  Alpha  ', timestamp: 123 },
  'alpha',
  { query: 'Beta', timestamp: 'not-a-date' },
  { query: '   ' },
  { query: 'Gamma' }
], 50);

assert.deepEqual(JSON.parse(JSON.stringify(normalized)), [
  { query: 'Alpha', timestamp: 123 },
  { query: 'Beta', timestamp: 0 },
  { query: 'Gamma', timestamp: 0 }
]);

let history = [];
for (let i = 0; i < 55; i += 1) history = addHistoryEntry(history, `query-${i}`, 50);
assert.equal(history.length, 50, 'history should be capped at the requested limit');
assert.equal(history[0].query, 'query-54', 'new searches should be newest first');
assert.equal(history[history.length - 1].query, 'query-5', 'old searches should be evicted first');

history = addHistoryEntry(history, ' QUERY-20 ', 50);
assert.equal(history[0].query, 'QUERY-20', 'repeating a query should move it to the front');
assert.equal(history.filter(entry => entry.query.toLowerCase() === 'query-20').length, 1);

console.log('query history tests passed');
