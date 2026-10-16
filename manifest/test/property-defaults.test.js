import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { propertyDefaultsPlugin } from '../plugins/property-defaults.js';
import { analyzeSource } from './analyze-source.js';

const defaultsOf = (source, names) => {
  const moduleDoc = {
    declarations: [{ kind: 'class', name: 'A', members: names.map((name) => ({ kind: 'field', name })) }],
  };
  analyzeSource(propertyDefaultsPlugin(), source, moduleDoc);
  return Object.fromEntries(moduleDoc.declarations[0].members.map((m) => [m.name, m.default]));
};

describe('propertyDefaultsPlugin', () => {
  test('should record literal values as written', () => {
    const source = `
      class A extends LitElement {
        static get properties() {
          return {
            opened: { type: Boolean, value: false },
            label: { type: String, value: '' },
            placeholder: { type: String, value: 'Search...' },
            size: { type: Number, value: 0 },
            selected: { type: Object, value: null },
            path: { type: String, value: \`/\` },
            flags: { type: Object, value: {} },
          };
        }
      }
    `;
    assert.deepEqual(defaultsOf(source, ['opened', 'label', 'placeholder', 'size', 'selected', 'path', 'flags']), {
      opened: 'false',
      label: "''",
      placeholder: "'Search...'",
      size: '0',
      selected: 'null',
      path: '`/`',
      flags: '{}',
    });
  });

  test('should record the result of a factory with a literal body', () => {
    const source = `
      class A extends LitElement {
        static get properties() {
          return {
            items: { type: Array, value: () => [] },
            i18n: { type: Object, value: () => ({}) },
            today: { type: Object, value: () => { return new Date(); } },
          };
        }
      }
    `;
    assert.deepEqual(defaultsOf(source, ['items', 'i18n', 'today']), { items: '[]', i18n: '{}', today: undefined });
  });

  test('should leave identifiers, calls and properties without a value out', () => {
    const source = `
      class A extends LitElement {
        static get properties() {
          return {
            touch: { type: Boolean, value: isTouch },
            date: { type: Object, value: new Date() },
            label: { type: String },
            size: Number,
          };
        }
      }
    `;
    assert.deepEqual(defaultsOf(source, ['touch', 'date', 'label', 'size']), {
      touch: undefined,
      date: undefined,
      label: undefined,
      size: undefined,
    });
  });

  test('should keep a default the analyzer found', () => {
    const source = `
      class A extends LitElement {
        static get properties() {
          return { count: { type: Number, value: 1 } };
        }
      }
    `;
    const moduleDoc = {
      declarations: [{ kind: 'class', name: 'A', members: [{ kind: 'field', name: 'count', default: '2' }] }],
    };
    analyzeSource(propertyDefaultsPlugin(), source, moduleDoc);
    assert.equal(moduleDoc.declarations[0].members[0].default, '2');
  });

  test('should record the value on the attribute of the field too', () => {
    const source = `
      class A extends LitElement {
        static get properties() {
          return { opened: { type: Boolean, value: false } };
        }
      }
    `;
    const moduleDoc = {
      declarations: [
        {
          kind: 'class',
          name: 'A',
          members: [{ kind: 'field', name: 'opened', attribute: 'opened' }],
          attributes: [{ name: 'opened', fieldName: 'opened' }],
        },
      ],
    };
    analyzeSource(propertyDefaultsPlugin(), source, moduleDoc);
    assert.equal(moduleDoc.declarations[0].attributes[0].default, 'false');
  });

  test('should record the values of a mixin', () => {
    const source = `
      export const AMixin = (superClass) =>
        class AMixinClass extends superClass {
          static get properties() {
            return { opened: { type: Boolean, value: false } };
          }
        };
    `;
    const moduleDoc = {
      declarations: [{ kind: 'mixin', name: 'AMixin', members: [{ kind: 'field', name: 'opened' }] }],
    };
    analyzeSource(propertyDefaultsPlugin(), source, moduleDoc);
    assert.equal(moduleDoc.declarations[0].members[0].default, 'false');
  });
});
