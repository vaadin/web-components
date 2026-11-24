import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { inheritancePlugin } from '../plugins/inheritance.js';

const field = (name, type, extra) => ({ kind: 'field', name, type: { text: type }, ...extra });
const ref = (name, module) => ({ name, module });

/**
 * Runs the plugin over the modules like the analyzer does and returns the manifest.
 * @param {object[]} modules
 */
function analyze(modules) {
  const manifest = { modules: structuredClone(modules) };
  const plugin = inheritancePlugin();
  for (const moduleDoc of manifest.modules) {
    plugin.moduleLinkPhase({ moduleDoc });
  }
  plugin.packageLinkPhase({ customElementsManifest: manifest });
  return manifest;
}

const declaration = (manifest, name) =>
  manifest.modules.flatMap((module) => module.declarations).find((d) => d.name === name);

const names = (items = []) =>
  items.map((item) => `${item.name}${item.inheritedFrom ? `<${item.inheritedFrom.name}` : ''}`);

// EmailField extends TextField, which applies InputFieldMixin, which applies FieldMixin
const fieldModules = [
  {
    path: 'packages/email-field/src/vaadin-email-field.js',
    declarations: [
      {
        kind: 'class',
        name: 'EmailField',
        superclass: { name: 'TextField', package: '@vaadin/text-field/src/vaadin-text-field.js' },
        members: [field('pattern', 'string')],
      },
    ],
  },
  {
    path: 'packages/text-field/src/vaadin-text-field.js',
    declarations: [
      {
        kind: 'class',
        name: 'TextField',
        superclass: { name: 'LitElement', package: 'lit' },
        mixins: [
          ref('InputFieldMixin', '/packages/text-field/src/vaadin-input-field-mixin.js'),
          { name: 'ThemableMixin', package: '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js' },
        ],
        members: [field('maxlength', 'number'), { kind: 'field', name: 'invalid', type: { text: 'boolean' } }],
        events: [{ name: 'change', type: { text: 'Event' } }],
      },
    ],
  },
  {
    path: 'packages/text-field/src/vaadin-input-field-mixin.js',
    declarations: [
      {
        kind: 'mixin',
        name: 'InputFieldMixin',
        mixins: [{ name: 'FieldMixin', package: '@vaadin/field-base/src/field-mixin.js' }],
        members: [field('label', 'string', { description: 'The input label' })],
        attributes: [{ name: 'label', fieldName: 'label' }],
      },
    ],
  },
  {
    path: 'packages/field-base/src/field-mixin.js',
    declarations: [
      {
        kind: 'mixin',
        name: 'FieldMixin',
        members: [
          field('label', 'string | null | undefined'),
          field('invalid', 'boolean | null', {
            description: 'Set when invalid',
            privacy: 'protected',
            attribute: 'invalid',
          }),
          field('_fieldId', 'string'),
        ],
        attributes: [
          { name: 'label', fieldName: 'label' },
          { name: 'invalid', fieldName: 'invalid' },
        ],
        events: [{ name: 'validated', type: { text: 'CustomEvent' } }],
      },
    ],
  },
];

describe('inheritancePlugin', () => {
  test('should collect the items of every ancestor nearest first', () => {
    const manifest = analyze(fieldModules);
    const emailField = declaration(manifest, 'EmailField');
    assert.deepEqual(names(emailField.members), [
      'pattern',
      'maxlength<TextField',
      'invalid<TextField',
      'label<InputFieldMixin',
      '_fieldId<FieldMixin',
    ]);
    assert.deepEqual(names(emailField.attributes), ['label<InputFieldMixin', 'invalid<FieldMixin']);
    assert.deepEqual(names(emailField.events), ['change<TextField', 'validated<FieldMixin']);
  });

  test('should take an inherited item from the nearest declaration', () => {
    const label = declaration(analyze(fieldModules), 'EmailField').members.find((m) => m.name === 'label');
    assert.deepEqual(label, {
      kind: 'field',
      name: 'label',
      type: { text: 'string' },
      description: 'The input label',
      inheritedFrom: { name: 'InputFieldMixin', module: 'packages/text-field/src/vaadin-input-field-mixin.js' },
    });
  });

  test('should fill the fields an override leaves out from the farther declarations', () => {
    const invalid = declaration(analyze(fieldModules), 'TextField').members.find((m) => m.name === 'invalid');
    assert.deepEqual(invalid, {
      kind: 'field',
      name: 'invalid',
      type: { text: 'boolean' },
      description: 'Set when invalid',
      privacy: 'protected',
      attribute: 'invalid',
    });
  });

  test('should rebuild mixins and leave own items without inheritedFrom', () => {
    const mixin = declaration(analyze(fieldModules), 'InputFieldMixin');
    assert.deepEqual(names(mixin.members), ['label', 'invalid<FieldMixin', '_fieldId<FieldMixin']);
    assert.equal(mixin.members[0].inheritedFrom, undefined);
  });

  test('should discard what the analyzer merged in after the module link phase', () => {
    const manifest = { modules: structuredClone(fieldModules) };
    const plugin = inheritancePlugin();
    for (const moduleDoc of manifest.modules) {
      plugin.moduleLinkPhase({ moduleDoc });
    }
    const mixin = declaration(manifest, 'InputFieldMixin');
    mixin.members[0].type = { text: 'string | null | undefined' };
    mixin.members[0].inheritedFrom = { name: 'FieldMixin', module: 'packages/field-base/src/field-mixin.js' };
    mixin.members.push({ ...field('invalid', 'boolean'), inheritedFrom: { name: 'Stale', module: 'stale.js' } });
    plugin.packageLinkPhase({ customElementsManifest: manifest });
    assert.deepEqual(mixin.members[0], field('label', 'string', { description: 'The input label' }));
    assert.equal(mixin.members[1].inheritedFrom.name, 'FieldMixin');
  });

  test('should leave a declaration without items untouched', () => {
    const modules = [{ path: 'a.js', declarations: [{ kind: 'class', name: 'Empty', members: [] }] }];
    assert.deepEqual(declaration(analyze(modules), 'Empty'), { kind: 'class', name: 'Empty' });
  });

  test('should drop the resolveInitializer marker of the analyzer', () => {
    const modules = [
      {
        path: 'packages/a/src/a.js',
        declarations: [
          {
            kind: 'class',
            name: 'A',
            members: [
              { kind: 'field', name: 'host', default: 'host', resolveInitializer: { module: 'packages/a/src/a.js' } },
            ],
          },
        ],
      },
    ];
    assert.deepEqual(declaration(analyze(modules), 'A').members, [{ kind: 'field', name: 'host', default: 'host' }]);
  });

  test('should tell mixins with the same name in different modules apart', () => {
    const modules = [
      {
        path: 'packages/component-base/src/resize-mixin.js',
        declarations: [{ kind: 'mixin', name: 'ResizeMixin', members: [field('_onResize', 'function')] }],
      },
      {
        path: 'packages/grid/src/vaadin-grid-resize-mixin.js',
        declarations: [
          { kind: 'mixin', name: 'ResizeMixin', members: [field('_recalculateColumnWidths', 'function')] },
        ],
      },
      {
        path: 'packages/grid/src/vaadin-grid.js',
        declarations: [
          {
            kind: 'class',
            name: 'Grid',
            mixins: [ref('ResizeMixin', '/packages/grid/src/vaadin-grid-resize-mixin.js')],
          },
        ],
      },
      {
        path: 'packages/scroller/src/vaadin-scroller.js',
        declarations: [
          {
            kind: 'class',
            name: 'Scroller',
            mixins: [{ name: 'ResizeMixin', package: '@vaadin/component-base/src/resize-mixin.js' }],
          },
        ],
      },
    ];
    const manifest = analyze(modules);
    assert.deepEqual(names(declaration(manifest, 'Grid').members), ['_recalculateColumnWidths<ResizeMixin']);
    assert.deepEqual(names(declaration(manifest, 'Scroller').members), ['_onResize<ResizeMixin']);
  });

  test('should visit an ancestor applied twice once', () => {
    const modules = [
      {
        path: 'packages/a/src/a.js',
        declarations: [
          {
            kind: 'class',
            name: 'A',
            mixins: [ref('WrapperMixin', '/packages/a/src/a.js'), ref('BaseMixin', '/packages/a/src/a.js')],
          },
          { kind: 'mixin', name: 'WrapperMixin', mixins: [ref('BaseMixin', '/packages/a/src/a.js')] },
          { kind: 'mixin', name: 'BaseMixin', members: [field('value', 'string')] },
        ],
      },
    ];
    assert.deepEqual(names(declaration(analyze(modules), 'A').members), ['value<BaseMixin']);
  });

  test('should place a mixin applied twice at its innermost application', () => {
    // dedupeMixin skips the outer application of ValidateMixin, so the override
    // of ConstraintsMixin is nearer, like in ComboBox
    const modules = [
      {
        path: 'packages/a/src/a.js',
        declarations: [
          {
            kind: 'class',
            name: 'A',
            mixins: [ref('ComboMixin', '/packages/a/src/a.js'), ref('ConstraintsMixin', '/packages/a/src/a.js')],
          },
          { kind: 'mixin', name: 'ComboMixin', mixins: [ref('ValidateMixin', '/packages/a/src/a.js')] },
          {
            kind: 'mixin',
            name: 'ConstraintsMixin',
            mixins: [ref('ValidateMixin', '/packages/a/src/a.js')],
            members: [{ kind: 'method', name: 'checkValidity', description: 'Checks the constraints' }],
          },
          {
            kind: 'mixin',
            name: 'ValidateMixin',
            members: [{ kind: 'method', name: 'checkValidity', description: 'Checks the value' }],
          },
        ],
      },
    ];
    const [checkValidity] = declaration(analyze(modules), 'A').members;
    assert.equal(checkValidity.description, 'Checks the constraints');
    assert.equal(checkValidity.inheritedFrom.name, 'ConstraintsMixin');
  });

  test('should give the same result for any module order', () => {
    const forward = analyze(fieldModules);
    const reversed = analyze([...fieldModules].reverse());
    for (const name of ['EmailField', 'TextField', 'InputFieldMixin', 'FieldMixin']) {
      assert.deepEqual(declaration(reversed, name), declaration(forward, name));
    }
  });
});
