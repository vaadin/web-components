import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getElements } from '../lib/cem-helpers.js';

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
