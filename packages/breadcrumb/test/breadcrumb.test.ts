import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';

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
    beforeEach(async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
    });

    it('should render without errors', () => {
      expect(breadcrumb.shadowRoot).to.be.ok;
    });

    it('should render a nav element in shadow DOM', () => {
      const nav = breadcrumb.shadowRoot!.querySelector('nav');
      expect(nav).to.be.ok;
    });

    it('should render an ol element inside the nav', () => {
      const nav = breadcrumb.shadowRoot!.querySelector('nav');
      const ol = nav!.querySelector('ol');
      expect(ol).to.be.ok;
    });

    it('should render slotted items inside li wrappers in the ol', () => {
      const ol = breadcrumb.shadowRoot!.querySelector('ol');
      const lis = ol!.querySelectorAll('li');
      expect(lis.length).to.equal(2);
    });

    it('should render named slots inside li wrappers', () => {
      const ol = breadcrumb.shadowRoot!.querySelector('ol');
      const lis = ol!.querySelectorAll('li');
      const slot0 = lis[0]!.querySelector('slot');
      const slot1 = lis[1]!.querySelector('slot');
      expect(slot0!.getAttribute('name')).to.equal('item-0');
      expect(slot1!.getAttribute('name')).to.equal('item-1');
    });

    it('should assign named slots to items', () => {
      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      expect(items[0]!.getAttribute('slot')).to.equal('item-0');
      expect(items[1]!.getAttribute('slot')).to.equal('item-1');
    });
  });

  describe('separators', () => {
    beforeEach(async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Shoes</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
    });

    it('should render separators between items', () => {
      const separators = breadcrumb.shadowRoot!.querySelectorAll('[part="separator"]');
      // Separator after each item except the last
      expect(separators.length).to.equal(2);
    });

    it('should not render a separator after the last item', () => {
      const ol = breadcrumb.shadowRoot!.querySelector('ol');
      const lis = ol!.querySelectorAll('li');
      const lastLi = lis[lis.length - 1];
      const separator = lastLi!.querySelector('[part="separator"]');
      expect(separator).to.not.be.ok;
    });

    it('should use a default directional chevron as separator', () => {
      const separator = breadcrumb.shadowRoot!.querySelector('[part="separator"]');
      expect(separator!.textContent!.trim()).to.equal('\u203A');
    });

    it('should set aria-hidden on separators', () => {
      const separators = breadcrumb.shadowRoot!.querySelectorAll('[part="separator"]');
      separators.forEach((sep) => {
        expect(sep.getAttribute('aria-hidden')).to.equal('true');
      });
    });
  });

  describe('custom separator', () => {
    beforeEach(async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <span slot="separator">/</span>
          <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Shoes</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
    });

    it('should use slotted content as separator', () => {
      const separators = breadcrumb.shadowRoot!.querySelectorAll('[part="separator"]');
      expect(separators.length).to.equal(2);
      separators.forEach((sep) => {
        expect(sep.textContent!.trim()).to.equal('/');
      });
    });

    it('should clone separator content between each pair of items', () => {
      const separators = breadcrumb.shadowRoot!.querySelectorAll('[part="separator"]');
      // Each separator should have its own clone
      expect(separators[0]).to.not.equal(separators[1]);
    });

    it('should render a custom separator icon correctly', async () => {
      // Replace separator with a custom icon element
      const oldSep = breadcrumb.querySelector('[slot="separator"]')!;
      oldSep.remove();
      const icon = document.createElement('span');
      icon.setAttribute('slot', 'separator');
      icon.textContent = '→';
      breadcrumb.appendChild(icon);
      await nextRender();
      // Allow slotchange + re-render
      await aTimeout(0);

      const separators = breadcrumb.shadowRoot!.querySelectorAll('[part="separator"]');
      separators.forEach((sep) => {
        expect(sep.textContent!.trim()).to.equal('→');
      });
    });
  });

  describe('dynamic items', () => {
    beforeEach(async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
    });

    it('should update separators when an item is added', async () => {
      const newItem = document.createElement('vaadin-breadcrumb-item') as BreadcrumbItem;
      newItem.textContent = 'Shoes';
      breadcrumb.appendChild(newItem);
      await nextRender();
      await aTimeout(0);

      const ol = breadcrumb.shadowRoot!.querySelector('ol');
      const lis = ol!.querySelectorAll('li');
      expect(lis.length).to.equal(3);

      const separators = breadcrumb.shadowRoot!.querySelectorAll('[part="separator"]');
      expect(separators.length).to.equal(2);
    });

    it('should update separators when an item is removed', async () => {
      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      items[1]!.remove();
      await nextRender();
      await aTimeout(0);

      const ol = breadcrumb.shadowRoot!.querySelector('ol');
      const lis = ol!.querySelectorAll('li');
      expect(lis.length).to.equal(1);

      const separators = breadcrumb.shadowRoot!.querySelectorAll('[part="separator"]');
      expect(separators.length).to.equal(0);
    });
  });

  describe('items', () => {
    beforeEach(async () => {
      breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      await nextRender();
    });

    it('should create breadcrumb-item children from items array', async () => {
      (breadcrumb as any).items = [
        { text: 'Home', path: '/' },
        { text: 'Products', path: '/products' },
        { text: 'Shoes' },
      ];
      await nextRender();
      await aTimeout(0);

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      expect(items.length).to.equal(3);
      expect(items[0]!.textContent).to.equal('Home');
      expect(items[0]!.getAttribute('path')).to.equal('/');
      expect(items[1]!.textContent).to.equal('Products');
      expect(items[1]!.getAttribute('path')).to.equal('/products');
      expect(items[2]!.textContent).to.equal('Shoes');
      expect(items[2]!.hasAttribute('path')).to.be.false;
    });

    it('should mark item with current: true as current', async () => {
      (breadcrumb as any).items = [
        { text: 'Home', path: '/' },
        { text: 'Shoes', current: true },
      ];
      await nextRender();
      await aTimeout(0);

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      expect(items[0]!.hasAttribute('current')).to.be.false;
      expect(items[1]!.hasAttribute('current')).to.be.true;
    });

    it('should replace previous children when items changes', async () => {
      (breadcrumb as any).items = [
        { text: 'Home', path: '/' },
        { text: 'Products', path: '/products' },
      ];
      await nextRender();
      await aTimeout(0);

      (breadcrumb as any).items = [{ text: 'Dashboard', path: '/dashboard' }];
      await nextRender();
      await aTimeout(0);

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      expect(items.length).to.equal(1);
      expect(items[0]!.textContent).to.equal('Dashboard');
      expect(items[0]!.getAttribute('path')).to.equal('/dashboard');
    });

    it('should clear programmatic items when set to null', async () => {
      (breadcrumb as any).items = [
        { text: 'Home', path: '/' },
        { text: 'Products', path: '/products' },
      ];
      await nextRender();
      await aTimeout(0);

      (breadcrumb as any).items = null;
      await nextRender();
      await aTimeout(0);

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      expect(items.length).to.equal(0);
    });

    it('should render separators for programmatic items', async () => {
      (breadcrumb as any).items = [
        { text: 'Home', path: '/' },
        { text: 'Products', path: '/products' },
        { text: 'Shoes', current: true },
      ];
      await nextRender();
      await aTimeout(0);

      const separators = breadcrumb.shadowRoot!.querySelectorAll('[part="separator"]');
      expect(separators.length).to.equal(2);
    });

    it('should function identically to declarative items', async () => {
      (breadcrumb as any).items = [
        { text: 'Home', path: '/' },
        { text: 'Shoes', path: '/shoes', current: true },
      ];
      await nextRender();
      await aTimeout(0);

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      // Items should be slotted correctly
      expect(items[0]!.getAttribute('slot')).to.equal('item-0');
      expect(items[1]!.getAttribute('slot')).to.equal('item-1');

      // Shadow DOM should have correct structure
      const ol = breadcrumb.shadowRoot!.querySelector('ol');
      const lis = ol!.querySelectorAll('li');
      expect(lis.length).to.equal(2);

      // Current item should have aria-current
      const currentLink = items[1]!.shadowRoot!.querySelector('a');
      expect(currentLink!.getAttribute('aria-current')).to.equal('page');
    });
  });

  describe('shadow parts', () => {
    beforeEach(async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
    });

    it('should have a "nav" shadow part', () => {
      const nav = breadcrumb.shadowRoot!.querySelector('[part="nav"]');
      expect(nav).to.be.ok;
      expect(nav!.localName).to.equal('nav');
    });

    it('should have a "list" shadow part', () => {
      const list = breadcrumb.shadowRoot!.querySelector('[part="list"]');
      expect(list).to.be.ok;
      expect(list!.localName).to.equal('ol');
    });

    it('should have "separator" shadow parts', () => {
      const separators = breadcrumb.shadowRoot!.querySelectorAll('[part="separator"]');
      expect(separators.length).to.equal(1);
      separators.forEach((sep) => {
        expect(sep.localName).to.equal('span');
      });
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
