const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
assert.equal(manifest.name, 'SearchHub');
assert.equal(manifest.start_url, './index.html');
assert.equal(manifest.scope, './');
assert.equal(manifest.display, 'standalone');
assert.deepEqual(manifest.icons.map(icon => icon.src), ['./icon.png', './icon.png']);
assert.ok(manifest.icons.every(icon => icon.type === 'image/png' && icon.purpose.includes('maskable')));

const serviceWorker = fs.readFileSync('sw.js', 'utf8');
assert.match(serviceWorker, /const CACHE_NAME = 'searchhub-app-shell-v2'/);
assert.match(serviceWorker, /'\.\/index\.html'/);
assert.match(serviceWorker, /event\.request\.method !== 'GET'/);
assert.match(serviceWorker, /requestURL\.origin !== self\.location\.origin/);
new vm.Script(serviceWorker, { filename: 'sw.js' });

const html = fs.readFileSync('index.html', 'utf8');
assert.match(html, /<link rel="manifest" href="manifest\.webmanifest">/);
assert.match(html, /navigator\.serviceWorker\.register\('\.\/sw\.js'\)/);

console.log('PWA tests passed');
