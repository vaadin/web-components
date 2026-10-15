import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { classPrivacyPlugin } from '../plugins/class-privacy.js';
import { analyzeSource } from './analyze-source.js';

const privacyOf = (source, names) => {
  const moduleDoc = { declarations: names.map((name) => ({ kind: 'class', name })) };
  analyzeSource(classPrivacyPlugin(), source, moduleDoc);
  return moduleDoc.declarations.map((d) => `${d.name}${d.privacy ? ` ${d.privacy}` : ''}`);
};

describe('classPrivacyPlugin', () => {
  test('should set the privacy from a @private or @protected tag', () => {
    const source = `
      /** @private */
      class Hidden extends LitElement {}
      /** @protected */
      class Base extends LitElement {}
      /** A public element. */
      class Shown extends LitElement {}
      class Untagged extends LitElement {}
    `;
    assert.deepEqual(privacyOf(source, ['Hidden', 'Base', 'Shown', 'Untagged']), [
      'Hidden private',
      'Base protected',
      'Shown',
      'Untagged',
    ]);
  });

  test('should set the privacy of the declaration with the class name only', () => {
    const source = `
      /** @private */
      class Hidden extends LitElement {}
    `;
    assert.deepEqual(privacyOf(source, ['Other', 'Hidden']), ['Other', 'Hidden private']);
  });
});
