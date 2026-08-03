const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'hotkey helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__hotkeys = { getCategoryHotkeyIndex };`,
  context,
  { filename: 'index.html' }
);

const { getCategoryHotkeyIndex } = context.__hotkeys;
assert.equal(getCategoryHotkeyIndex('1'), 0);
assert.equal(getCategoryHotkeyIndex('9'), 8);
assert.equal(getCategoryHotkeyIndex('0'), 9);
assert.equal(getCategoryHotkeyIndex('/'), -1);
assert.equal(getCategoryHotkeyIndex('a'), -1);

console.log('hotkey tests passed');
