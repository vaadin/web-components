import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-item.js';

describe('vaadin-item', () => {
  let item, tagName;

  beforeEach(() => {
    item = fixtureSync('<vaadin-item>label</vaadin-item>');
    tagName = item.tagName.toLowerCase();
  });

  it('should be defined in custom element registry', () => {
    expect(customElements.get(tagName)).to.be.ok;
  });

  it('should have a valid static "is" getter', () => {
    expect(customElements.get(tagName).is).to.equal(tagName);
  });

  it('should extend item-mixin', () => {
    expect(item._hasVaadinItemMixin).to.be.true;
  });
});
