import assert from 'node:assert/strict';
import fs from 'node:fs';
import { mock, test } from 'node:test';
import {
  deepTransform,
  entryPointModule,
  extractPackageName,
  findEntryPoints,
  splitManifest,
  transformModulePath,
  transformReference,
} from '../lib/split-paths.js';
import { createTree } from './create-tree.js';

test('extractPackageName reads the package of a module path', () => {
  assert.equal(extractPackageName('packages/button/src/vaadin-button.js'), 'button');
  assert.equal(extractPackageName('src/vaadin-button.js'), null);
  assert.equal(extractPackageName('packagesx/button.js'), null);
});

test('transformModulePath strips the package prefix', () => {
  assert.equal(transformModulePath('packages/button/src/vaadin-button.js'), 'src/vaadin-button.js');
});

test('transformReference keeps same-package references relative', () => {
  for (const module of ['/packages/button/src/foo.js', 'packages/button/src/foo.js']) {
    assert.deepEqual(transformReference({ name: 'A', module }, 'button'), { name: 'A', module: 'src/foo.js' });
  }
});

test('transformReference turns other-package references into package references', () => {
  for (const module of ['/packages/a11y-base/src/foo.js', 'packages/a11y-base/src/foo.js']) {
    assert.deepEqual(transformReference({ name: 'A', module }, 'button'), {
      name: 'A',
      package: '@vaadin/a11y-base/src/foo.js',
    });
  }
});

test('transformReference keeps relative and external references', () => {
  assert.deepEqual(transformReference({ name: 'A', module: 'src/foo.js' }, 'button'), {
    name: 'A',
    module: 'src/foo.js',
  });
  assert.deepEqual(transformReference({ name: 'A', package: 'lit' }, 'button'), { name: 'A', package: 'lit' });
  // Not a reference, such as a declaration whose field is called `module`
  const field = { name: 'module', module: { kind: 'field' } };
  assert.equal(transformReference(field, 'button'), field);
});

test('deepTransform transforms nested references', () => {
  const mod = {
    path: 'packages/button/src/vaadin-button.js',
    declarations: [
      {
        mixins: [{ name: 'ElementMixin', module: 'packages/component-base/src/element-mixin.js' }],
        superclass: { name: 'Base', module: '/packages/button/src/base.js' },
      },
    ],
  };
  assert.deepEqual(deepTransform(mod, 'button'), {
    path: 'packages/button/src/vaadin-button.js',
    declarations: [
      {
        mixins: [{ name: 'ElementMixin', package: '@vaadin/component-base/src/element-mixin.js' }],
        superclass: { name: 'Base', module: 'src/base.js' },
      },
    ],
  });
});

test('findEntryPoints lists the root entry points with their source modules', (t) => {
  const root = createTree(t, {
    'packages/grid/vaadin-grid.js': '',
    'packages/grid/vaadin-grid-column.js': '',
    'packages/grid/vaadin-grid.d.ts': '',
    'packages/grid/src/vaadin-grid.js': '',
  });
  assert.deepEqual(findEntryPoints('grid', root), [
    { path: 'vaadin-grid-column.js', source: 'src/vaadin-grid-column.js' },
    { path: 'vaadin-grid.js', source: 'src/vaadin-grid.js' },
  ]);
});

test('findEntryPoints sorts the entry points by name whatever the file system order', (t) => {
  const readdir = mock.method(fs, 'readdirSync', () => ['vaadin-grid.js', 'vaadin-grid-column.js']);
  t.after(() => readdir.mock.restore());
  assert.deepEqual(
    findEntryPoints('grid', '/repo').map((entry) => entry.path),
    ['vaadin-grid-column.js', 'vaadin-grid.js'],
  );
});

test('entryPointModule re-exports the source module', () => {
  assert.deepEqual(entryPointModule({ path: 'vaadin-button.js', source: 'src/vaadin-button.js' }), {
    kind: 'javascript-module',
    path: 'vaadin-button.js',
    declarations: [],
    exports: [{ kind: 'js', name: '*', declaration: { name: '*', module: 'src/vaadin-button.js' } }],
  });
});

test('splitManifest builds one manifest per package with the entry points first', (t) => {
  const root = createTree(t, {
    'packages/button/vaadin-button.js': '',
    'packages/button/vaadin-button-mixin.js': '',
    'packages/a11y-base/src/focus-mixin.js': '',
  });
  // The per-package manifests copy the schema version and readme of the root manifest
  const rootManifest = {
    schemaVersion: '2.1.0',
    readme: 'README.md',
    modules: [
      {
        kind: 'javascript-module',
        path: 'packages/a11y-base/src/focus-mixin.js',
        declarations: [{ kind: 'mixin', name: 'FocusMixin' }],
        exports: [
          {
            kind: 'js',
            name: 'FocusMixin',
            declaration: { name: 'FocusMixin', module: 'packages/a11y-base/src/focus-mixin.js' },
          },
        ],
      },
      {
        kind: 'javascript-module',
        path: 'packages/button/src/vaadin-button.js',
        declarations: [
          {
            kind: 'class',
            name: 'Button',
            superclass: { name: 'LitElement', package: 'lit' },
            mixins: [{ name: 'FocusMixin', module: '/packages/a11y-base/src/focus-mixin.js' }],
          },
        ],
        exports: [
          {
            kind: 'custom-element-definition',
            name: 'vaadin-button',
            declaration: { name: 'Button', module: 'packages/button/src/vaadin-button.js' },
          },
        ],
      },
    ],
  };

  const manifests = splitManifest(rootManifest, root);

  assert.deepEqual([...manifests.keys()], ['a11y-base', 'button']);
  assert.deepEqual(manifests.get('a11y-base'), {
    schemaVersion: '2.1.0',
    readme: 'README.md',
    modules: [
      {
        kind: 'javascript-module',
        path: 'src/focus-mixin.js',
        declarations: [{ kind: 'mixin', name: 'FocusMixin' }],
        exports: [
          { kind: 'js', name: 'FocusMixin', declaration: { name: 'FocusMixin', module: 'src/focus-mixin.js' } },
        ],
      },
    ],
  });
  // `vaadin-button-mixin.js` has no source module in the manifest, so it gets no entry
  assert.deepEqual(
    manifests.get('button').modules.map((mod) => mod.path),
    ['vaadin-button.js', 'src/vaadin-button.js'],
  );
  assert.deepEqual(manifests.get('button').modules[1].declarations[0].mixins, [
    { name: 'FocusMixin', package: '@vaadin/a11y-base/src/focus-mixin.js' },
  ]);
  assert.deepEqual(manifests.get('button').modules[1].exports[0].declaration, {
    name: 'Button',
    module: 'src/vaadin-button.js',
  });
});

test('splitManifest skips and warns about a module outside packages/', (t) => {
  const root = createTree(t, {});
  const warn = mock.method(console, 'warn', () => {});
  t.after(() => warn.mock.restore());
  const manifests = splitManifest({ schemaVersion: '1.0.0', readme: '', modules: [{ path: 'dev/foo.js' }] }, root);
  assert.equal(manifests.size, 0);
  assert.equal(warn.mock.callCount(), 1);
  assert.match(warn.mock.calls[0].arguments[0], /dev\/foo\.js/u);
});
