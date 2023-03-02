import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '@vaadin/virtual-list';

describe('template', () => {
  let list;

  beforeEach(() => {
    list = fixtureSync(`
      <vaadin-virtual-list>
        <template>
          [[index]]
        </template>
      </vaadin-virtual-list>
    `);

    list.items = [0, 1, 2];
  });

  it('should use the template to render the items', () => {
    const itemElements = Array.from(list.children).filter((el) => el.localName !== 'template');
    expect(itemElements.length).to.equal(3);
    itemElements.forEach((el, index) => expect(el.textContent.trim()).to.equal(String(index)));
  });
});
