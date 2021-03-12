import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '@vaadin/vaadin-item/vaadin-item.js';
import '../vaadin-list-box.js';

describe('vaadin-list-box', () => {
  let listBox;

  beforeEach(() => {
    listBox = fixtureSync(`
      <vaadin-list-box>
        <vaadin-item>Foo</vaadin-item>
        <vaadin-item>Bar</vaadin-item>
      </vaadin-list-box>
    `);
  });

  it('should extend list-mixin', () => {
    expect(listBox._hasVaadinListMixin).to.be.true;
  });

  it('should have an unnamed slot for content', () => {
    const slot = listBox.shadowRoot.querySelector('slot:not([name])');
    expect(slot.assignedNodes().length).to.be.equal(5);
  });

  it('should have role attribute', () => {
    expect(listBox.getAttribute('role')).to.equal('list');
  });
});
