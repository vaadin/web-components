import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getElements, isPrimitiveType } from '../lib/cem-helpers.js';

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
