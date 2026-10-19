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

/** Replaces `console.warn` until the end of the test and returns the mock. */
const mockWarn = (t) => {
  const warn = mock.method(console, 'warn', () => {});
  t.after(() => warn.mock.restore());
  return warn.mock;
};

/** A labs component with its root re-export, the inner entry file and the source module. */
const LABS_TREE = {
  'labs/vaadin-sandbox.js': "export * from './sandbox/vaadin-sandbox.js';",
  'labs/sandbox/vaadin-sandbox.js': "export * from './src/vaadin-sandbox.js';",
  'labs/sandbox/src/vaadin-sandbox.js': '',
};

/** A root manifest module with one declaration and one export of it. */
const module = (path, declaration, exportKind = 'js') => ({
  kind: 'javascript-module',
  path,
  declarations: [declaration],
  exports: [{ kind: exportKind, name: declaration.name, declaration: { name: declaration.name, module: path } }],
});

// The same shapes as `packages/button` and `labs/sandbox` see them
const PACKAGES = [
  { pkg: 'button', prefix: 'packages/button', inner: 'src' },
  { pkg: 'labs', prefix: 'labs/sandbox', inner: 'sandbox/src' },
];

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
  for (const { pkg, prefix, inner } of PACKAGES) {
    for (const module of [`/${prefix}/src/foo.js`, `${prefix}/src/foo.js`]) {
      assert.deepEqual(transformReference({ name: 'A', module }, pkg), { name: 'A', module: `${inner}/foo.js` });
    }
  }
});

test('transformReference turns other-package references into package references', () => {
  for (const { pkg } of PACKAGES) {
    for (const module of ['/packages/a11y-base/src/foo.js', 'packages/a11y-base/src/foo.js']) {
      assert.deepEqual(transformReference({ name: 'A', module }, pkg), {
        name: 'A',
        package: '@vaadin/a11y-base/src/foo.js',
      });
    }
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
  for (const { pkg, prefix, inner } of PACKAGES) {
    const mod = {
      path: `${prefix}/src/vaadin-x.js`,
      declarations: [
        {
          mixins: [{ name: 'ElementMixin', module: 'packages/component-base/src/element-mixin.js' }],
          superclass: { name: 'Base', module: `/${prefix}/src/base.js` },
        },
      ],
    };
    assert.deepEqual(deepTransform(mod, pkg), {
      path: `${prefix}/src/vaadin-x.js`,
      declarations: [
        {
          mixins: [{ name: 'ElementMixin', package: '@vaadin/component-base/src/element-mixin.js' }],
          superclass: { name: 'Base', module: `${inner}/base.js` },
        },
      ],
    });
  }
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
  const root = createTree(t, LABS_TREE);
  assert.deepEqual(findEntryPoints('labs', root), [
    { path: 'vaadin-sandbox.js', source: 'sandbox/src/vaadin-sandbox.js' },
  ]);
});

test('findEntryPoints warns about a labs re-export of an unexpected form', (t) => {
  const root = createTree(t, { 'labs/vaadin-sandbox.js': "export { Sandbox } from './sandbox/vaadin-sandbox.js';" });
  const warn = mockWarn(t);
  assert.deepEqual(findEntryPoints('labs', root), []);
  assert.equal(warn.callCount(), 1);
  assert.match(warn.calls[0].arguments[0], /labs\/vaadin-sandbox\.js/u);
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
  const focusMixin = module('packages/a11y-base/src/focus-mixin.js', { kind: 'mixin', name: 'FocusMixin' });
  const button = module(
    'packages/button/src/vaadin-button.js',
    {
      kind: 'class',
      name: 'Button',
      superclass: { name: 'LitElement', package: 'lit' },
      mixins: [{ name: 'FocusMixin', module: '/packages/a11y-base/src/focus-mixin.js' }],
    },
    'custom-element-definition',
  );
  // The per-package manifests copy the schema version and readme of the root manifest
  const rootManifest = { schemaVersion: '2.1.0', readme: 'README.md', modules: [focusMixin, button] };

  const manifests = splitManifest(rootManifest, root);

  assert.deepEqual([...manifests.keys()], ['a11y-base', 'button']);
  assert.deepEqual(manifests.get('a11y-base'), {
    schemaVersion: '2.1.0',
    readme: 'README.md',
    modules: [module('src/focus-mixin.js', { kind: 'mixin', name: 'FocusMixin' })],
  });
  // `vaadin-button-mixin.js` has no source module in the manifest, so it gets no entry
  const [entry, source] = manifests.get('button').modules;
  assert.deepEqual([entry.path, source.path], ['vaadin-button.js', 'src/vaadin-button.js']);
  assert.deepEqual(source.declarations[0].mixins, [
    { name: 'FocusMixin', package: '@vaadin/a11y-base/src/focus-mixin.js' },
  ]);
  assert.deepEqual(source.exports[0].declaration, { name: 'Button', module: 'src/vaadin-button.js' });
});

test('splitManifest builds the labs manifest with the root re-exports as entry points', (t) => {
  const root = createTree(t, LABS_TREE);
  const sandbox = module(
    'labs/sandbox/src/vaadin-sandbox.js',
    { kind: 'class', name: 'Sandbox' },
    'custom-element-definition',
  );

  const manifests = splitManifest({ schemaVersion: '1.0.0', readme: '', modules: [sandbox] }, root);

  assert.deepEqual([...manifests.keys()], ['labs']);
  const [entry, source] = manifests.get('labs').modules;
  assert.deepEqual([entry.path, source.path], ['vaadin-sandbox.js', 'sandbox/src/vaadin-sandbox.js']);
  assert.deepEqual(entry.exports[0].declaration, { name: '*', module: 'sandbox/src/vaadin-sandbox.js' });
  assert.deepEqual(source.exports[0].declaration, { name: 'Sandbox', module: 'sandbox/src/vaadin-sandbox.js' });
});

test('splitManifest skips and warns about a module outside packages/ and labs/', (t) => {
  const root = createTree(t, {});
  const warn = mockWarn(t);
  const manifests = splitManifest({ schemaVersion: '1.0.0', readme: '', modules: [{ path: 'dev/foo.js' }] }, root);
  assert.equal(manifests.size, 0);
  assert.equal(warn.callCount(), 1);
  assert.match(warn.calls[0].arguments[0], /dev\/foo\.js/u);
});
