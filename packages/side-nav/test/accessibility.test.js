import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
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
});
