import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';

// Enable experimental breadcrumb component
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

import '../vaadin-breadcrumb.js';
import '../vaadin-breadcrumb-item.js';

describe('vaadin-breadcrumb', () => {
  let breadcrumb;

  beforeEach(async () => {
    breadcrumb = fixtureSync(`
      <vaadin-breadcrumb>
        <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
        <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
        <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
      </vaadin-breadcrumb>
    `);
    await nextFrame();
  });

  describe('basic functionality', () => {
    it('should have proper tag name', () => {
      expect(breadcrumb.localName).to.equal('vaadin-breadcrumb');
    });

    it('should have navigation role', () => {
      expect(breadcrumb.getAttribute('role')).to.equal('navigation');
    });

    it('should have aria-label', () => {
      expect(breadcrumb.getAttribute('aria-label')).to.equal('Breadcrumb');
    });

    it('should contain breadcrumb items', () => {
      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      expect(items).to.have.length(3);
    });
  });

  describe('item management', () => {
    it('should mark last item as last', () => {
      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      expect(items[0].hasAttribute('last')).to.be.false;
      expect(items[1].hasAttribute('last')).to.be.false;
      expect(items[2].hasAttribute('last')).to.be.true;
    });

    it('should update last attribute when items change', async () => {
      const newItem = document.createElement('vaadin-breadcrumb-item');
      newItem.textContent = 'New Item';
      breadcrumb.appendChild(newItem);
      await nextFrame();

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      expect(items[2].hasAttribute('last')).to.be.false;
      expect(items[3].hasAttribute('last')).to.be.true;
    });
  });
});

describe('vaadin-breadcrumb-item', () => {
  let item;

  beforeEach(async () => {
    item = fixtureSync('<vaadin-breadcrumb-item href="/test">Test Item</vaadin-breadcrumb-item>');
    await nextFrame();
  });

  describe('basic functionality', () => {
    it('should have proper tag name', () => {
      expect(item.localName).to.equal('vaadin-breadcrumb-item');
    });

    it('should have listitem role', () => {
      expect(item.getAttribute('role')).to.equal('listitem');
    });

    it('should render link when href is set', () => {
      const link = item.shadowRoot.querySelector('a[part="link"]');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('/test');
    });

    it('should render span when href is not set', async () => {
      const noHrefItem = fixtureSync('<vaadin-breadcrumb-item>No Link</vaadin-breadcrumb-item>');
      await nextFrame();

      const span = noHrefItem.shadowRoot.querySelector('span[part="link"]');
      const link = noHrefItem.shadowRoot.querySelector('a[part="link"]');
      expect(span).to.exist;
      expect(link).to.not.exist;
    });
  });

  describe('separator', () => {
    it('should render separator by default', () => {
      const separator = item.shadowRoot.querySelector('[part="separator"]');
      expect(separator).to.exist;
    });

    it('should not render separator for last item', async () => {
      item._setLast(true);
      await nextFrame();

      const separator = item.shadowRoot.querySelector('[part="separator"]');
      expect(separator).to.not.exist;
    });
  });

  describe('disabled state', () => {
    it('should handle disabled state', async () => {
      item.disabled = true;
      await nextFrame();

      const link = item.shadowRoot.querySelector('[part="link"]');
      expect(link.getAttribute('href')).to.be.null;
      expect(link.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('target attribute', () => {
    it('should set target on link', async () => {
      item.target = '_blank';
      await nextFrame();

      const link = item.shadowRoot.querySelector('[part="link"]');
      expect(link.getAttribute('target')).to.equal('_blank');
    });
  });

  describe('router-ignore attribute', () => {
    it('should set router-ignore on link', async () => {
      item.routerIgnore = true;
      await nextFrame();

      const link = item.shadowRoot.querySelector('[part="link"]');
      expect(link.hasAttribute('router-ignore')).to.be.true;
    });
  });

  describe('last item behavior', () => {
    it('should render span instead of link when last', async () => {
      item._setLast(true);
      await nextFrame();

      const span = item.shadowRoot.querySelector('span[part="link"]');
      const link = item.shadowRoot.querySelector('a[part="link"]');
      expect(span).to.exist;
      expect(link).to.not.exist;
    });

    it('should set aria-current="page" for last item', async () => {
      item._setLast(true);
      await nextFrame();

      const span = item.shadowRoot.querySelector('[part="link"]');
      expect(span.getAttribute('aria-current')).to.equal('page');
    });
  });
});
