import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';

// Enable experimental feature flag before importing elements
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

import '../src/vaadin-breadcrumb.js';
import type { Breadcrumb } from '../src/vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../src/vaadin-breadcrumb-item.js';

describe('breadcrumb', () => {
  let breadcrumb: Breadcrumb;

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      tagName = breadcrumb.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('rendering', () => {
    beforeEach(() => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
    });

    it('should render without errors', () => {
      expect(breadcrumb.shadowRoot).to.be.ok;
    });
  });
});

describe('breadcrumb-item', () => {
  let item: BreadcrumbItem;

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      item = fixtureSync('<vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>');
      tagName = item.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('rendering', () => {
    beforeEach(() => {
      item = fixtureSync('<vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>');
    });

    it('should render without errors', () => {
      expect(item.shadowRoot).to.be.ok;
    });
  });
});
