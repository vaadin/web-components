import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { publicApiPlugin } from '../plugins/public-api.js';

const field = (name, extra) => ({ kind: 'field', name, type: { text: 'string' }, ...extra });
const names = (items = []) => items.map((item) => item.name);

/** Runs the plugin over one module with the given declarations and returns the module. */
function run(declarations, exports = []) {
  const manifest = { modules: [{ path: 'a.js', declarations, exports }] };
  publicApiPlugin().packageLinkPhase({ customElementsManifest: manifest });
  return manifest.modules[0];
}

describe('publicApiPlugin', () => {
  test('should drop private and protected classes with their exports', () => {
    const exportOf = (name) => ({ kind: 'js', name, declaration: { name, module: 'a.js' } });
    const module = run(
      [
        { kind: 'class', name: 'Shown' },
        { kind: 'class', name: 'Hidden', privacy: 'private' },
        { kind: 'class', name: 'Base', privacy: 'protected' },
      ],
      [exportOf('Shown'), exportOf('Hidden'), exportOf('Base')],
    );
    assert.deepEqual(names(module.declarations), ['Shown']);
    assert.deepEqual(names(module.exports), ['Shown']);
  });

  test('should keep the public members sorted by name, ignoring case', () => {
    const { declarations } = run([
      {
        kind: 'class',
        name: 'A',
        members: [
          field('zebra'),
          field('_internal'),
          field('Beta'),
          field('secret', { privacy: 'private' }),
          field('guarded', { privacy: 'protected' }),
          field('slotName'),
          { kind: 'method', name: 'is', static: true },
          { kind: 'method', name: 'show', static: true },
          field('is'),
          field('alpha'),
        ],
      },
    ]);
    assert.deepEqual(names(declarations[0].members), ['alpha', 'Beta', 'is', 'show', 'zebra']);
  });

  test('should keep the attributes that can be set from HTML, in dash-case', () => {
    const { declarations } = run([
      {
        kind: 'class',
        name: 'A',
        members: [
          field('clearButtonVisible', { attribute: 'clearButtonVisible' }),
          field('items', { type: { text: 'Array<string>' }, attribute: 'items' }),
          field('opened', { readonly: true, attribute: 'opened' }),
          field('_hidden', { attribute: '_hidden' }),
          field('dir', { attribute: 'dir', inheritedFrom: { name: 'DirMixin', module: 'dir-mixin.js' } }),
        ],
        attributes: [
          { name: 'clearButtonVisible', fieldName: 'clearButtonVisible', type: { text: 'boolean | null | undefined' } },
          { name: 'items', fieldName: 'items', type: { text: 'Array<string>' } },
          { name: 'opened', fieldName: 'opened', type: { text: 'boolean' } },
          { name: '_hidden', fieldName: '_hidden', type: { text: 'boolean' } },
          { name: 'dir', fieldName: 'dir', type: { text: 'string' }, inheritedFrom: { name: 'DirMixin' } },
          { name: 'class' },
          { name: 'aria-label', fieldName: 'ariaLabel', type: { text: 'string' } },
        ],
      },
    ]);
    const [declaration] = declarations;
    assert.deepEqual(names(declaration.attributes), ['class', 'clear-button-visible']);
    assert.deepEqual(
      declaration.members.map((m) => `${m.name}${m.attribute ? ` [${m.attribute}]` : ''}`),
      ['clearButtonVisible [clear-button-visible]', 'dir', 'items', 'opened'],
    );
  });

  test('should drop reflects with the attribute of a field', () => {
    const { declarations } = run([
      {
        kind: 'class',
        name: 'A',
        members: [field('renderer', { type: { text: 'Renderer' }, attribute: 'renderer', reflects: true })],
        attributes: [{ name: 'renderer', fieldName: 'renderer', type: { text: 'Renderer' } }],
      },
    ]);
    assert.deepEqual(declarations[0].members, [{ kind: 'field', name: 'renderer', type: { text: 'Renderer' } }]);
    assert.deepEqual(declarations[0].attributes, []);
  });

  test('should keep the named events that are not internal', () => {
    const { declarations } = run([
      {
        kind: 'class',
        name: 'A',
        events: [
          { name: 'value-changed', type: { text: 'CustomEvent' } },
          { type: { text: 'CustomEvent' } },
          { name: 'eventName', type: { text: 'CustomEvent' } },
          { name: 'change', type: { text: 'Event' }, inheritedFrom: { name: 'PolylitMixin' } },
          { name: 'Change', type: { text: 'Event' } },
        ],
      },
    ]);
    assert.deepEqual(names(declarations[0].events), ['Change', 'value-changed']);
  });

  test('should leave empty and missing item arrays as they are', () => {
    const { declarations } = run([{ kind: 'class', name: 'A', members: [] }]);
    assert.deepEqual(declarations[0], { kind: 'class', name: 'A', members: [] });
  });

  test('should remove the modules without declarations and exports', () => {
    const manifest = {
      modules: [
        { path: 'empty.js', declarations: [], exports: [] },
        { path: 'private.js', declarations: [{ kind: 'class', name: 'Hidden', privacy: 'private' }] },
        { path: 'entry.js', declarations: [], exports: [{ kind: 'js', name: '*' }] },
        { path: 'a.js', declarations: [{ kind: 'class', name: 'A' }] },
      ],
    };
    publicApiPlugin().packageLinkPhase({ customElementsManifest: manifest });
    assert.deepEqual(
      manifest.modules.map((m) => m.path),
      ['entry.js', 'a.js'],
    );
  });
});
