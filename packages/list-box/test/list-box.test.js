import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/item/vaadin-item.js';
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
});
