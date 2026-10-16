import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { getElements, isPrimitiveType, listComponentDirs, listPackageDirs, packageDir } from '../lib/cem-helpers.js';
import { createTree } from './create-tree.js';

const files = (...paths) => Object.fromEntries(paths.map((file) => [file, '']));

test('getElements collects the custom elements of all modules', () => {
  const manifest = {
    modules: [
      {
        declarations: [
          { kind: 'class', customElement: true, tagName: 'vaadin-a', name: 'A' },
          { kind: 'class', customElement: true, name: 'Base' },
          { kind: 'class', tagName: 'vaadin-c', name: 'C' },
          { kind: 'mixin', customElement: true, tagName: 'vaadin-m', name: 'AMixin' },
        ],
      },
      { path: 'no-declarations.js' },
      { declarations: [{ kind: 'class', customElement: true, tagName: 'vaadin-b', name: 'B' }] },
    ],
  };
  assert.deepEqual(
    getElements(manifest).map((element) => element.tagName),
    ['vaadin-a', 'vaadin-b'],
  );
});

test('isPrimitiveType accepts the types an HTML attribute can carry', () => {
  for (const text of ['string', 'number', 'boolean', 'null', 'undefined', 'string | null | undefined', 'Boolean']) {
    assert.equal(isPrimitiveType(text), true, text);
  }
  for (const text of [
    'Object | undefined',
    'Object | null',
    'array',
    'number[] | null | undefined',
    'HTMLElement',
    'function',
    'GridBodyRenderer | null | undefined',
    'ComboBoxItem | string | undefined',
    'any',
    '',
  ]) {
    assert.equal(isPrimitiveType(text), false, text);
  }
});

test('listComponentDirs lists the components of packages and labs, sorted by name', (t) => {
  const root = createTree(
    t,
    files(
      'packages/button/src/vaadin-button.js',
      'packages/card/package.json',
      'packages/.DS_Store',
      'labs/package.json',
      'labs/vaadin-sandbox.js',
      'labs/sandbox/src/vaadin-sandbox.js',
      'labs/beta/src/vaadin-beta.js',
      'labs/notes/readme.md',
    ),
  );
  assert.deepEqual(listComponentDirs(root), [
    { name: 'beta', dir: path.join(root, 'labs/beta'), pkg: 'labs' },
    { name: 'button', dir: path.join(root, 'packages/button'), pkg: 'packages' },
    { name: 'card', dir: path.join(root, 'packages/card'), pkg: 'packages' },
    { name: 'sandbox', dir: path.join(root, 'labs/sandbox'), pkg: 'labs' },
  ]);
});

test('listComponentDirs skips a labs folder with only test/', (t) => {
  // Ignored screenshots stay behind after a graduation
  const root = createTree(
    t,
    files('packages/sandbox/src/vaadin-sandbox.js', 'labs/sandbox/test/visual/base/screenshots/sandbox/failed/a.png'),
  );
  assert.deepEqual(listComponentDirs(root), [
    { name: 'sandbox', dir: path.join(root, 'packages/sandbox'), pkg: 'packages' },
  ]);
});

test('listComponentDirs works without labs', (t) => {
  const root = createTree(t, files('packages/button/package.json'));
  assert.deepEqual(
    listComponentDirs(root).map((component) => component.name),
    ['button'],
  );
});

test('listComponentDirs throws when a name exists in packages and labs', (t) => {
  const root = createTree(t, files('packages/sandbox/src/vaadin-sandbox.js', 'labs/sandbox/src/vaadin-sandbox.js'));
  assert.throws(() => listComponentDirs(root), /"sandbox" exists in both/u);
});

test('listPackageDirs lists the package directories plus labs, sorted', (t) => {
  const root = createTree(
    t,
    files('packages/card/package.json', 'packages/button/package.json', 'packages/.DS_Store', 'labs/package.json'),
  );
  assert.deepEqual(listPackageDirs(root), ['button', 'card', 'labs']);
});

test('listPackageDirs works without labs', (t) => {
  const root = createTree(t, files('packages/button/package.json'));
  assert.deepEqual(listPackageDirs(root), ['button']);
});

test('listPackageDirs skips labs without package.json', (t) => {
  const root = createTree(t, files('packages/button/package.json', 'labs/sandbox/src/vaadin-sandbox.js'));
  assert.deepEqual(listPackageDirs(root), ['button']);
});

test('packageDir resolves a package and labs against the root', () => {
  assert.equal(packageDir('button', '/repo'), path.join('/repo', 'packages', 'button'));
  assert.equal(packageDir('labs', '/repo'), path.join('/repo', 'labs'));
});
