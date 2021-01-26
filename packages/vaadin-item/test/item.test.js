import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-item.js';

describe('vaadin-item', () => {
  let item;

  beforeEach(() => {
    item = fixtureSync('<vaadin-item>label</vaadin-item>');
  });

  it('should have a valid version number', () => {
    expect(item.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
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
