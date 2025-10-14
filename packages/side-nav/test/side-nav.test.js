import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-side-nav.js';

describe('side-nav', () => {
  let sideNav;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      sideNav = fixtureSync('<vaadin-side-nav></vaadin-side-nav>');
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

    beforeEach(async () => {
      sideNav = fixtureSync(`
        <vaadin-side-nav collapsible>
          <span slot="label">Main menu</span>
          <vaadin-side-nav-item>Item 1</vaadin-side-nav-item>
          <vaadin-side-nav-item>Item 2</vaadin-side-nav-item>
        </vaadin-side-nav>
      `);
      await nextRender();
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

  describe('expanding items', () => {
    let items;

    beforeEach(async () => {
      sideNav = fixtureSync(`
        <vaadin-side-nav collapsible>
          <vaadin-side-nav-item>
            <vaadin-side-nav-item slot="children">
              <vaadin-side-nav-item slot="children"></vaadin-side-nav-item>
            </vaadin-side-nav-item>
          </vaadin-side-nav-item>
        </vaadin-side-nav>
      `);
      items = sideNav.querySelectorAll('vaadin-side-nav-item');
      await nextRender();
    });

    it('should expand parent items when path matches by default', async () => {
      items[2].path = '';
      await items[2].updateComplete;
      expect(items[0].expanded).to.be.true;
      expect(items[1].expanded).to.be.true;
    });

    it('should not expand parent items when path matches if noAutoExpand is set to true', async () => {
      sideNav.noAutoExpand = true;
      items[2].path = '';
      await items[2].updateComplete;
      expect(items[0].expanded).to.be.false;
      expect(items[1].expanded).to.be.false;
    });
  });
});
