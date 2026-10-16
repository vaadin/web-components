import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import {
  deepTransform,
  entryPointModule,
  extractPackageName,
  findEntryPoints,
  labsEntrySource,
  transformModulePath,
  transformReference,
} from '../lib/split-paths.js';
import { createTree } from './create-tree.js';

test('extractPackageName maps packages and labs module paths', () => {
  assert.equal(extractPackageName('packages/button/src/vaadin-button.js'), 'button');
  assert.equal(extractPackageName('labs/sandbox/src/vaadin-sandbox.js'), 'labs');
  assert.equal(extractPackageName('src/vaadin-button.js'), null);
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
  assert.deepEqual(transformReference({ name: 'A', module: '/packages/a11y-base/src/foo.js' }, 'button'), {
    name: 'A',
    package: '@vaadin/a11y-base/src/foo.js',
  });
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
});

test('deepTransform transforms nested references', () => {
  const mod = {
    path: 'labs/sandbox/src/vaadin-sandbox.js',
    declarations: [
      {
        mixins: [{ name: 'ElementMixin', module: 'packages/component-base/src/element-mixin.js' }],
        superclass: { name: 'Base', module: '/labs/sandbox/src/base.js' },
      },
    ],
  };
  assert.deepEqual(deepTransform(mod, 'labs'), {
    path: 'labs/sandbox/src/vaadin-sandbox.js',
    declarations: [
      {
        mixins: [{ name: 'ElementMixin', package: '@vaadin/component-base/src/element-mixin.js' }],
        superclass: { name: 'Base', module: 'sandbox/src/base.js' },
      },
    ],
  });
});

test('labsEntrySource reads the source module of a root re-export', () => {
  const content = "import './sandbox/vaadin-sandbox.js';\n\nexport * from './sandbox/vaadin-sandbox.js';\n";
  assert.equal(labsEntrySource(content), 'sandbox/src/vaadin-sandbox.js');
  assert.equal(labsEntrySource('export * from "./sandbox/vaadin-sandbox.js";'), 'sandbox/src/vaadin-sandbox.js');
  assert.equal(labsEntrySource("export * from './src/vaadin-sandbox.js';"), null);
  assert.equal(labsEntrySource('export * from \'./sandbox/vaadin-sandbox.js";'), null);
});

test('findEntryPoints lists only the root entry points', (t) => {
  const root = createTree(t, {
    'packages/button/vaadin-button.js': "export * from './src/vaadin-button.js';",
    'packages/button/src/vaadin-button.js': '',
    'labs/vaadin-sandbox.js': "export * from './sandbox/vaadin-sandbox.js';",
    'labs/sandbox/vaadin-sandbox.js': "export * from './src/vaadin-sandbox.js';",
    'labs/sandbox/src/vaadin-sandbox.js': '',
  });
  assert.deepEqual(findEntryPoints('button', root), [{ path: 'vaadin-button.js', source: 'src/vaadin-button.js' }]);
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
  assert.deepEqual(entryPointModule({ path: 'vaadin-sandbox.js', source: 'sandbox/src/vaadin-sandbox.js' }), {
    kind: 'javascript-module',
    path: 'vaadin-sandbox.js',
    declarations: [],
    exports: [{ kind: 'js', name: '*', declaration: { name: '*', module: 'sandbox/src/vaadin-sandbox.js' } }],
  });
});
