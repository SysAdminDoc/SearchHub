const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.background.service_worker, 'background.js');
assert.equal(manifest.omnibox.keyword, 'sh');
assert.deepEqual(manifest.permissions, ['tabs']);

const background = fs.readFileSync('background.js', 'utf8');
assert.match(background, /SEARCHHUB_DEFAULT_ENGINES = 'google,bing,ddg'/);
assert.match(background, /chrome\.omnibox\.onInputEntered/);
assert.match(background, /chrome\.tabs\.update/);
assert.match(background, /chrome\.tabs\.create/);
new vm.Script(background, { filename: 'background.js' });

console.log('omnibox tests passed');
