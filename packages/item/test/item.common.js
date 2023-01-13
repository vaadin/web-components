import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';

describe('vaadin-item', () => {
  let item, tagName;

  beforeEach(async () => {
    item = fixtureSync('<vaadin-item>label</vaadin-item>');
    await nextRender();
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

  it('should have an unnamed slot for label', () => {
    const slot = item.shadowRoot.querySelector('slot:not([name])');
    const content = slot.assignedNodes()[0];
    expect(content.nodeType).to.be.equal(3);
    expect(content.textContent.trim()).to.be.equal('label');
  });

  it('should have a content part wrapping slot', () => {
    const slot = item.shadowRoot.querySelector('slot');
    const content = item.shadowRoot.querySelector('[part="content"]');
    expect(content).to.be.instanceof(Element);
    expect(slot.parentElement).to.equal(content);
  });

  it('should have a block context for content part', () => {
    const content = item.shadowRoot.querySelector('[part="content"]');
    expect(getComputedStyle(content).display).to.equal('block');
  });
});
