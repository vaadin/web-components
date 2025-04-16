import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/item/src/vaadin-item.js';
import '../src/vaadin-list-box.js';

describe('vaadin-list-box', () => {
  let listBox, tagName;

  beforeEach(async () => {
    listBox = fixtureSync(`
      <vaadin-list-box>
        <vaadin-item>Foo</vaadin-item>
        <vaadin-item>Bar</vaadin-item>
      </vaadin-list-box>
    `);
    await nextRender();
    tagName = listBox.tagName.toLowerCase();
  });

  it('should be defined in custom element registry', () => {
    expect(customElements.get(tagName)).to.be.ok;
  });

  it('should have a valid static "is" getter', () => {
    expect(customElements.get(tagName).is).to.equal(tagName);
  });

  it('should set role attribute to list-box', () => {
    expect(listBox.getAttribute('role')).to.equal('listbox');
  });
});
