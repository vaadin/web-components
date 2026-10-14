import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { preserveOverridesPlugin } from '../plugins/preserve-overrides.js';

const field = (name, type, privacy) => ({ kind: 'field', name, type: type && { text: type }, privacy });

describe('preserveOverridesPlugin', () => {
  test('should restore own type and privacy that the inheritance merge overrode', () => {
    const plugin = preserveOverridesPlugin();
    const grid = {
      kind: 'class',
      name: 'Grid',
      members: [field('i18n', 'GridI18n | undefined'), field('orientation', 'string', 'private')],
    };
    plugin.moduleLinkPhase({ moduleDoc: { path: 'grid.js', declarations: [grid] } });
    // The analyzer merges the ancestor's values in after the module link phase
    grid.members[0].type = { text: 'Object | undefined' };
    grid.members[0].inheritedFrom = { name: 'I18nMixin' };
    grid.members[1].privacy = 'public';
    plugin.packageLinkPhase({ customElementsManifest: { modules: [{ path: 'grid.js', declarations: [grid] }] } });
    assert.equal(grid.members[0].type.text, 'GridI18n | undefined');
    assert.deepEqual(grid.members[0].inheritedFrom, { name: 'I18nMixin' });
    assert.equal(grid.members[1].privacy, 'private');
  });

  test('should keep inherited type and privacy when the own item has none', () => {
    const plugin = preserveOverridesPlugin();
    const checkbox = { kind: 'class', name: 'Checkbox', members: [field('_hasValue')] };
    plugin.moduleLinkPhase({ moduleDoc: { path: 'checkbox.js', declarations: [checkbox] } });
    checkbox.members[0].type = { text: 'boolean' };
    checkbox.members[0].privacy = 'protected';
    plugin.packageLinkPhase({
      customElementsManifest: { modules: [{ path: 'checkbox.js', declarations: [checkbox] }] },
    });
    assert.equal(checkbox.members[0].type.text, 'boolean');
    assert.equal(checkbox.members[0].privacy, 'protected');
  });

  test('should restore event types declared with @fires', () => {
    const plugin = preserveOverridesPlugin();
    const combo = { kind: 'class', name: 'ComboBox', events: [{ name: 'change', type: { text: 'Event' } }] };
    plugin.moduleLinkPhase({ moduleDoc: { path: 'combo-box.js', declarations: [combo] } });
    combo.events[0].type = { text: 'CustomEvent' };
    plugin.packageLinkPhase({ customElementsManifest: { modules: [{ path: 'combo-box.js', declarations: [combo] }] } });
    assert.equal(combo.events[0].type.text, 'Event');
  });

  test('should tell declarations with the same name in different modules apart', () => {
    const plugin = preserveOverridesPlugin();
    const a = { kind: 'mixin', name: 'ResizeMixin', members: [field('size', 'number')] };
    const b = { kind: 'mixin', name: 'ResizeMixin', members: [field('size', 'string')] };
    plugin.moduleLinkPhase({ moduleDoc: { path: 'a/resize-mixin.js', declarations: [a] } });
    plugin.moduleLinkPhase({ moduleDoc: { path: 'b/resize-mixin.js', declarations: [b] } });
    a.members[0].type = { text: 'Object' };
    b.members[0].type = { text: 'Object' };
    plugin.packageLinkPhase({
      customElementsManifest: {
        modules: [
          { path: 'a/resize-mixin.js', declarations: [a] },
          { path: 'b/resize-mixin.js', declarations: [b] },
        ],
      },
    });
    assert.equal(a.members[0].type.text, 'number');
    assert.equal(b.members[0].type.text, 'string');
  });

  test('should leave declarations without a snapshot untouched', () => {
    const plugin = preserveOverridesPlugin();
    const variable = { kind: 'variable', name: 'DEFAULT_I18N' };
    const element = { kind: 'class', name: 'Late', members: [field('x', 'Object')] };
    plugin.packageLinkPhase({
      customElementsManifest: { modules: [{ path: 'late.js', declarations: [variable, element] }] },
    });
    assert.equal(element.members[0].type.text, 'Object');
  });
});
