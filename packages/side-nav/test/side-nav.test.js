import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-side-nav.js';

describe('side-nav', () => {
  let sideNav;

  beforeEach(async () => {
    sideNav = fixtureSync(`
      <vaadin-side-nav collapsible>
        <span slot="label">Main menu</span>
        <vaadin-side-nav-item>Item 1</vaadin-side-nav-item>
        <vaadin-side-nav-item>Item 2</vaadin-side-nav-item>
      </vaadin-side-nav>
    `);
    await nextRender();
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

  describe('collapsing', () => {
    let label;

    beforeEach(() => {
      label = sideNav.shadowRoot.querySelector('[part="label"]');
    });

    it('should set collapsed property to true on button element click', async () => {
      label.click();
      await sideNav.updateComplete;
      expect(sideNav.collapsed).to.be.true;
    });

    it('should set collapsed property to false on subsequent button click', async () => {
      label.click();
      await sideNav.updateComplete;
      expect(sideNav.collapsed).to.be.true;

      label.click();
      await sideNav.updateComplete;
      expect(sideNav.collapsed).to.be.false;
    });

    it('should reflect collapsed property to the corresponding attribute', async () => {
      expect(sideNav.hasAttribute('collapsed')).to.be.false;

      label.click();
      await sideNav.updateComplete;
      expect(sideNav.hasAttribute('collapsed')).to.be.true;
    });

    it('should dispatch collapsed-changed event when collapsed changes', async () => {
      const spy = sinon.spy();
      sideNav.addEventListener('collapsed-changed', spy);
      label.click();
      await sideNav.updateComplete;
      expect(spy.calledOnce).to.be.true;
    });
  });
});
