import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../enable.js';
import '../vaadin-side-nav-item.js';
import '../vaadin-side-nav.js';

describe('accessibility', () => {
  describe('side nav item', () => {
    let item;

    beforeEach(() => {
      item = fixtureSync('<vaadin-side-nav-item></vaadin-side-nav-item>');
    });

    describe('ARIA roles', () => {
      it('should set "listitem" role on side-nav-item', () => {
        expect(item.getAttribute('role')).to.equal('listitem');
      });
    });
  });

  describe('side nav', () => {
    let sideNav;

    beforeEach(() => {
      sideNav = fixtureSync('<vaadin-side-nav></vaadin-side-nav>');
    });

    describe('ARIA roles', () => {
      it('should set "navigation" role on side-nav', () => {
        expect(sideNav.getAttribute('role')).to.equal('navigation');
      });
    });
  });
});
