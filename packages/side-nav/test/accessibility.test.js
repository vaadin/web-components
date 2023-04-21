import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-side-nav-item.js';
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
});
