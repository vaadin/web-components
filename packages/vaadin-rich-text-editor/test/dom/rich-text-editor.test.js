import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-rich-text-editor.js';

describe('vaadin-rich-text-editor', () => {
  let toggle;

  beforeEach(() => {
    toggle = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
  });

  it('default', async () => {
    await expect(toggle).shadowDom.to.equalSnapshot();
  });
});
