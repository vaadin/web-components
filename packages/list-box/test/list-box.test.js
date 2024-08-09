import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/item/vaadin-item.js';
import '../vaadin-list-box.js';

describe('vaadin-list-box', () => {
  let listBox, tagName;

  beforeEach(() => {
    listBox = fixtureSync(`
      <vaadin-list-box>
        <vaadin-item>Foo</vaadin-item>
        <vaadin-item>Bar</vaadin-item>
      </vaadin-list-box>
    `);
    tagName = listBox.tagName.toLowerCase();
  });

  it('should be defined in custom element registry', () => {
    expect(customElements.get(tagName)).to.be.ok;
  });

  it('should have a valid static "is" getter', () => {
    expect(customElements.get(tagName).is).to.equal(tagName);
  });
});
