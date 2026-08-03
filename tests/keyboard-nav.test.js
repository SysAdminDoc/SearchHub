const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'keyboard navigation helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__keyboard = { getSelectedChipNavigationIndex };`,
  context,
  { filename: 'index.html' }
);

const { getSelectedChipNavigationIndex } = context.__keyboard;
assert.equal(getSelectedChipNavigationIndex(0, 'ArrowLeft', 3), 2);
assert.equal(getSelectedChipNavigationIndex(2, 'ArrowRight', 3), 0);
assert.equal(getSelectedChipNavigationIndex(1, 'ArrowUp', 3), 0);
assert.equal(getSelectedChipNavigationIndex(1, 'ArrowDown', 3), 2);
assert.equal(getSelectedChipNavigationIndex(2, 'Home', 3), 0);
assert.equal(getSelectedChipNavigationIndex(0, 'End', 3), 2);
assert.equal(getSelectedChipNavigationIndex(0, 'PageDown', 3), 0);
assert.equal(getSelectedChipNavigationIndex(0, 'ArrowRight', 0), -1);

console.log('keyboard navigation tests passed');
