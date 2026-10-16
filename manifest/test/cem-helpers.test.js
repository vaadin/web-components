import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { getElements, isPrimitiveType, listPackageDirs, packageDir } from '../lib/cem-helpers.js';
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

test('listPackageDirs lists the package directories, sorted', (t) => {
  const root = createTree(t, files('packages/card/package.json', 'packages/button/package.json', 'packages/.DS_Store'));
  assert.deepEqual(listPackageDirs(root), ['button', 'card']);
});

test('packageDir resolves a package against the root', () => {
  assert.equal(packageDir('button', '/repo'), path.join('/repo', 'packages', 'button'));
});
