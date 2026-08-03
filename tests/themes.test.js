const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'theme helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__themes = { THEME_OPTIONS, normalizeTheme };`,
  context,
  { filename: 'index.html' }
);

const { THEME_OPTIONS, normalizeTheme } = context.__themes;
assert.deepEqual(JSON.parse(JSON.stringify(THEME_OPTIONS)), ['light', 'oled', 'dracula', 'nord']);
assert.equal(normalizeTheme('light'), 'light');
assert.equal(normalizeTheme('oled'), 'oled');
assert.equal(normalizeTheme('dracula'), 'dracula');
assert.equal(normalizeTheme('nord'), 'nord');
assert.equal(normalizeTheme('unknown'), 'dracula');
assert.equal(normalizeTheme(null), 'dracula');

console.log('theme tests passed');
