import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../enable.js';
import '../vaadin-side-nav-item.js';
import '../vaadin-side-nav.js';

describe('accessibility', () => {
  describe('ARIA roles', () => {
    let sideNav;

    beforeEach(async () => {
      sideNav = fixtureSync('<vaadin-side-nav></vaadin-side-nav>');
      await nextRender(sideNav);
    });

    it('should set "navigation" role by default on side-nav', () => {
      expect(sideNav.getAttribute('role')).to.equal('navigation');
    });

    it('should have custom role effective', async () => {
      const sideNavWithCustomRole = fixtureSync('<vaadin-side-nav role="custom role"></vaadin-side-nav>');
      await nextRender(sideNavWithCustomRole);
      expect(sideNavWithCustomRole.getAttribute('role')).to.equal('custom role');
    });
  });

  describe('label', () => {
    let sideNav;

    beforeEach(async () => {
      sideNav = fixtureSync('<vaadin-side-nav></vaadin-side-nav>');
      await nextRender();
    });

    it('should not have aria-labelledby attribute by default', () => {
      expect(sideNav.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should set id on the lazily added label element', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');

      sideNav.appendChild(label);
      await nextFrame();

      const ID_REGEX = /^side-nav-label-\d+$/u;
      expect(label.getAttribute('id')).to.match(ID_REGEX);
    });

    it('should not override custom id on the lazily added label', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');
      label.id = 'custom-label';

      sideNav.appendChild(label);
      await nextFrame();

      expect(label.getAttribute('id')).to.equal('custom-label');
    });

    it('should set aria-labelledby attribute when adding a label', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');

      sideNav.appendChild(label);
      await nextFrame();

      const ID_REGEX = /^side-nav-label-\d+$/u;
      expect(sideNav.getAttribute('aria-labelledby')).to.match(ID_REGEX);
      expect(sideNav.getAttribute('aria-labelledby')).to.be.equal(label.id);
    });

    it('should remove aria-labelledby attribute when removing a label', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');

      sideNav.appendChild(label);
      await nextFrame();

      sideNav.removeChild(label);
      await nextFrame();

      expect(sideNav.hasAttribute('aria-labelledby')).to.be.false;
    });
  });
});
