import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumbs-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('vaadin-breadcrumbs-item', () => {
  let item;

  beforeEach(() => {
    item = fixtureSync('<vaadin-breadcrumbs-item></vaadin-breadcrumbs-item>');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = item.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });
});
