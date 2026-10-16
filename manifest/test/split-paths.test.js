import assert from 'node:assert/strict';
import fs from 'node:fs';
import { mock, test } from 'node:test';
import {
  deepTransform,
  entryPointModule,
  extractPackageName,
  findEntryPoints,
  labsEntrySource,
  splitManifest,
  transformModulePath,
  transformReference,
} from '../lib/split-paths.js';
import { createTree } from './create-tree.js';

test('extractPackageName reads the package of a module path', () => {
  assert.equal(extractPackageName('packages/button/src/vaadin-button.js'), 'button');
  assert.equal(extractPackageName('labs/sandbox/src/vaadin-sandbox.js'), 'labs');
  assert.equal(extractPackageName('src/vaadin-button.js'), null);
  assert.equal(extractPackageName('packagesx/button.js'), null);
  assert.equal(extractPackageName('labsx/sandbox.js'), null);
});

test('transformModulePath strips the package prefix', () => {
  assert.equal(transformModulePath('packages/button/src/vaadin-button.js'), 'src/vaadin-button.js');
  assert.equal(transformModulePath('labs/sandbox/src/vaadin-sandbox.js'), 'sandbox/src/vaadin-sandbox.js');
});

test('transformReference keeps same-package references relative', () => {
  for (const module of ['/packages/button/src/foo.js', 'packages/button/src/foo.js']) {
    assert.deepEqual(transformReference({ name: 'A', module }, 'button'), { name: 'A', module: 'src/foo.js' });
  }
  for (const module of ['/labs/sandbox/src/foo.js', 'labs/sandbox/src/foo.js']) {
    assert.deepEqual(transformReference({ name: 'A', module }, 'labs'), { name: 'A', module: 'sandbox/src/foo.js' });
  }
});

test('transformReference turns other-package references into package references', () => {
  for (const module of ['/packages/a11y-base/src/foo.js', 'packages/a11y-base/src/foo.js']) {
    assert.deepEqual(transformReference({ name: 'A', module }, 'button'), {
      name: 'A',
      package: '@vaadin/a11y-base/src/foo.js',
    });
  }
  assert.deepEqual(transformReference({ name: 'A', module: 'packages/a11y-base/src/foo.js' }, 'labs'), {
    name: 'A',
    package: '@vaadin/a11y-base/src/foo.js',
  });
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

test('deepTransform keeps labs references relative inside labs', () => {
  const mod = {
    path: 'labs/sandbox/src/vaadin-sandbox.js',
    declarations: [
      {
        mixins: [{ name: 'ElementMixin', module: 'packages/component-base/src/element-mixin.js' }],
        superclass: { name: 'Base', module: '/labs/sandbox/src/base.js' },
      },
    ],
  };
  assert.deepEqual(deepTransform(mod, 'labs').declarations[0], {
    mixins: [{ name: 'ElementMixin', package: '@vaadin/component-base/src/element-mixin.js' }],
    superclass: { name: 'Base', module: 'sandbox/src/base.js' },
  });
});

test('labsEntrySource reads the source module of a root re-export', () => {
  const content = "import './sandbox/vaadin-sandbox.js';\n\nexport * from './sandbox/vaadin-sandbox.js';\n";
  assert.equal(labsEntrySource(content), 'sandbox/src/vaadin-sandbox.js');
  assert.equal(labsEntrySource('export * from "./sandbox/vaadin-sandbox.js";'), 'sandbox/src/vaadin-sandbox.js');
  assert.equal(labsEntrySource("export * from './src/vaadin-sandbox.js';"), null);
  assert.equal(labsEntrySource('export * from \'./sandbox/vaadin-sandbox.js";'), null);
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

test('findEntryPoints lists only the root re-exports of labs', (t) => {
  const root = createTree(t, {
    'labs/vaadin-sandbox.js': "export * from './sandbox/vaadin-sandbox.js';",
    'labs/sandbox/vaadin-sandbox.js': "export * from './src/vaadin-sandbox.js';",
    'labs/sandbox/src/vaadin-sandbox.js': '',
  });
  assert.deepEqual(findEntryPoints('labs', root), [
    { path: 'vaadin-sandbox.js', source: 'sandbox/src/vaadin-sandbox.js' },
  ]);
});

test('findEntryPoints warns about a labs re-export of an unexpected form', (t) => {
  const root = createTree(t, { 'labs/vaadin-sandbox.js': "export { Sandbox } from './sandbox/vaadin-sandbox.js';" });
  const warn = mock.method(console, 'warn', () => {});
  t.after(() => warn.mock.restore());
  assert.deepEqual(findEntryPoints('labs', root), []);
  assert.equal(warn.mock.callCount(), 1);
  assert.match(warn.mock.calls[0].arguments[0], /labs\/vaadin-sandbox\.js/u);
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

test('splitManifest builds the labs manifest with the root re-exports as entry points', (t) => {
  const root = createTree(t, {
    'labs/vaadin-sandbox.js': "export * from './sandbox/vaadin-sandbox.js';",
    'labs/sandbox/vaadin-sandbox.js': "export * from './src/vaadin-sandbox.js';",
    'labs/sandbox/src/vaadin-sandbox.js': '',
  });
  const rootManifest = {
    schemaVersion: '1.0.0',
    readme: '',
    modules: [
      {
        kind: 'javascript-module',
        path: 'labs/sandbox/src/vaadin-sandbox.js',
        declarations: [{ kind: 'class', name: 'Sandbox' }],
        exports: [
          {
            kind: 'custom-element-definition',
            name: 'vaadin-sandbox',
            declaration: { name: 'Sandbox', module: 'labs/sandbox/src/vaadin-sandbox.js' },
          },
        ],
      },
    ],
  };

  const manifests = splitManifest(rootManifest, root);

  assert.deepEqual([...manifests.keys()], ['labs']);
  assert.deepEqual(
    manifests.get('labs').modules.map((mod) => mod.path),
    ['vaadin-sandbox.js', 'sandbox/src/vaadin-sandbox.js'],
  );
  assert.deepEqual(manifests.get('labs').modules[0].exports[0].declaration, {
    name: '*',
    module: 'sandbox/src/vaadin-sandbox.js',
  });
  assert.deepEqual(manifests.get('labs').modules[1].exports[0].declaration, {
    name: 'Sandbox',
    module: 'sandbox/src/vaadin-sandbox.js',
  });
});

test('splitManifest skips and warns about a module outside packages/ and labs/', (t) => {
  const root = createTree(t, {});
  const warn = mock.method(console, 'warn', () => {});
  t.after(() => warn.mock.restore());
  const manifests = splitManifest({ schemaVersion: '1.0.0', readme: '', modules: [{ path: 'dev/foo.js' }] }, root);
  assert.equal(manifests.size, 0);
  assert.equal(warn.mock.callCount(), 1);
  assert.match(warn.mock.calls[0].arguments[0], /dev\/foo\.js/u);
});
