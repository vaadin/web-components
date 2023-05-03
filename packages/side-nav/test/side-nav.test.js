import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-side-nav.js';

describe('side-nav', () => {
  let sideNav;

  beforeEach(() => {
    sideNav = fixtureSync(`
      <vaadin-side-nav>
        <span slot="label">Main menu</span>
        <span>Item 1</span>
        <span>Item 2</span>
      </vaadin-side-nav>
    `);
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = sideNav.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });
});
