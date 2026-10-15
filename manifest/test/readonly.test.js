import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { readonlyPlugin } from '../plugins/readonly.js';
import { analyzeSource } from './analyze-source.js';

const members = (...names) => names.map((name) => ({ kind: 'field', name }));

describe('readonlyPlugin', () => {
  test('should mark the fields declared with readOnly: true', () => {
    const source = `
      class Grid extends LitElement {
        static get properties() {
          return {
            loading: { type: Boolean, readOnly: true },
            items: { type: Array },
            opened: { type: Boolean, readOnly: false },
            size: Number,
          };
        }
      }
    `;
    const moduleDoc = {
      declarations: [{ kind: 'class', name: 'Grid', members: members('loading', 'items', 'opened', 'size') }],
    };
    analyzeSource(readonlyPlugin(), source, moduleDoc);
    assert.deepEqual(
      moduleDoc.declarations[0].members.map((m) => `${m.name}${m.readonly ? ' readonly' : ''}`),
      ['loading readonly', 'items', 'opened', 'size'],
    );
  });

  test('should mark the fields of a mixin', () => {
    const source = `
      export const GridMixin = (superClass) =>
        class GridMixinClass extends superClass {
          static get properties() {
            return { loading: { type: Boolean, readOnly: true } };
          }
        };
    `;
    const moduleDoc = { declarations: [{ kind: 'mixin', name: 'GridMixin', members: members('loading') }] };
    analyzeSource(readonlyPlugin(), source, moduleDoc);
    assert.equal(moduleDoc.declarations[0].members[0].readonly, true);
  });

  test('should leave a class without properties untouched', () => {
    const source = `class Plain extends LitElement { static get is() { return 'vaadin-plain'; } }`;
    const moduleDoc = { declarations: [{ kind: 'class', name: 'Plain', members: members('is') }] };
    analyzeSource(readonlyPlugin(), source, moduleDoc);
    assert.equal(moduleDoc.declarations[0].members[0].readonly, undefined);
  });
});
