import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-tab.js';

describe('tab', () => {
  let tab;

  beforeEach(() => {
    tab = fixtureSync('<vaadin-tab>text-content</vaadin-tab>');
  });

  it('should have a correct localName', () => {
    expect(tab.localName).to.be.equal('vaadin-tab');
  });

  it('should have a correct role', () => {
    expect(tab.getAttribute('role')).to.be.equal('tab');
  });

  it('should have an unnamed slot for content', () => {
    const slot = tab.shadowRoot.querySelector('slot:not([name])');
    const content = slot.assignedNodes()[0];
    expect(content.nodeType).to.be.equal(3);
    expect(content.textContent.trim()).to.be.equal('text-content');
  });

  it('should extend vaadin-item-mixin', () => {
    expect(tab._hasVaadinItemMixin).to.be.true;
  });
});
