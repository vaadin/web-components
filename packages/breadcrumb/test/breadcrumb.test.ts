import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumb.js';
import type { Breadcrumb } from '../vaadin-breadcrumb.js';

describe('vaadin-breadcrumb', () => {
  let element: Breadcrumb;

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      element = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      tagName = element.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      await nextRender();
    });

    it('should have default role', () => {
      expect(element.getAttribute('role')).to.equal('navigation');
    });

    it('should have tabindex', () => {
      expect(element.tabIndex).to.equal(0);
    });

    it('should be focusable', () => {
      element.focus();
      expect(document.activeElement).to.equal(element);
    });
  });
});
