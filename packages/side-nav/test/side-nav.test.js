import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../enable.js';
import '../vaadin-side-nav.js';

describe('side-nav', () => {
  let sideNav;

  beforeEach(() => {
    sideNav = fixtureSync(`
      <vaadin-side-nav collapsible>
        <span slot="label">Main menu</span>
        <vaadin-side-nav-item>Item 1</vaadin-side-nav-item>
        <vaadin-side-nav-item>Item 2</vaadin-side-nav-item>
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

  describe('collapsing', () => {
    it('should be initially collapsible', () => {
      expect(sideNav.collapsible).to.be.true;
    });

    it('should not be collapsible after setting attribute', () => {
      sideNav.collapsible = false;
      expect(sideNav.collapsible).to.be.false;
    });

    it('should not be initially collapsed', () => {
      expect(sideNav.collapsed).to.be.false;
    });

    it('should be collapsed after setting attribute', async () => {
      sideNav.collapsed = true;
      await nextRender(sideNav);
      expect(sideNav.collapsed).to.be.true;
    });

    it('should expand programmatically', () => {
      sideNav.toggleCollapsed();
      expect(sideNav.collapsed).to.be.true;
    });

    it('should collapse programmatically', () => {
      sideNav.toggleCollapsed();
      sideNav.toggleCollapsed();
      expect(sideNav.collapsed).to.be.false;
    });
  });
});
