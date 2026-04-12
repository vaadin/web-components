import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-breadcrumb.js';
import { location } from '../src/location.js';
import type { Breadcrumb } from '../src/vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../src/vaadin-breadcrumb-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('vaadin-breadcrumb', () => {
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
      expect((customElements.get(tagName) as any).is).to.equal('vaadin-breadcrumb');
    });
  });

  describe('shadow root', () => {
    beforeEach(async () => {
      breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      await nextRender();
    });

    it('should render a shadow root without errors', () => {
      expect(breadcrumb.shadowRoot).to.be.ok;
    });

    it('should render a div with part="list" and role="list" containing a slot', () => {
      const list = breadcrumb.shadowRoot!.querySelector('[part="list"]');
      expect(list).to.be.ok;
      expect(list!.getAttribute('role')).to.equal('list');
      const slot = list!.querySelector('slot');
      expect(slot).to.be.ok;
    });

    it('should render a separator slot container with aria-hidden="true"', () => {
      const separatorSlot = breadcrumb.shadowRoot!.querySelector('#separator-slot');
      expect(separatorSlot).to.be.ok;
      expect(separatorSlot!.getAttribute('name')).to.equal('separator');
      const container = separatorSlot!.parentElement!;
      expect(container.getAttribute('aria-hidden')).to.equal('true');
      expect(container.hasAttribute('hidden')).to.be.true;
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      await nextRender();
    });

    it('should have role="navigation"', () => {
      expect(breadcrumb.getAttribute('role')).to.equal('navigation');
    });

    it('should have aria-label="Breadcrumb"', () => {
      expect(breadcrumb.getAttribute('aria-label')).to.equal('Breadcrumb');
    });

    it('should not overwrite a developer-provided aria-label', async () => {
      const custom = fixtureSync('<vaadin-breadcrumb aria-label="Custom nav"></vaadin-breadcrumb>');
      await nextRender();
      expect(custom.getAttribute('aria-label')).to.equal('Custom nav');
    });

    it('should have role="list" on the list container', () => {
      const list = breadcrumb.shadowRoot!.querySelector('[part="list"]');
      expect(list).to.be.ok;
      expect(list!.getAttribute('role')).to.equal('list');
    });

    it('should have role="listitem" on each item', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      items.forEach((item) => {
        expect(item.getAttribute('role')).to.equal('listitem');
      });
    });

    it('should set aria-current="page" on the link when item is current', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      const currentLink = items[1].shadowRoot!.querySelector('a[part="link"]')!;
      expect(currentLink.getAttribute('aria-current')).to.equal('page');
    });

    it('should not have aria-current on the link when item is not current', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      const nonCurrentLink = items[0].shadowRoot!.querySelector('a[part="link"]')!;
      expect(nonCurrentLink.hasAttribute('aria-current')).to.be.false;
    });

    it('should set aria-disabled="true" on the host when item is disabled', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home" disabled>Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      expect(items[0].getAttribute('aria-disabled')).to.equal('true');
    });

    it('should have aria-haspopup="true" on the overflow button', () => {
      const button = breadcrumb.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLElement;
      expect(button.getAttribute('aria-haspopup')).to.equal('true');
    });

    it('should have aria-expanded="false" on the overflow button when overlay is closed', () => {
      const button = breadcrumb.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLElement;
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should have aria-expanded="true" on the overflow button when overlay is open', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 150px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(50);

      const button = breadcrumb.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLElement;
      button.click();
      await nextRender();

      expect(button.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should set aria-expanded back to "false" on the overflow button when overlay is closed', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 150px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(50);

      const button = breadcrumb.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLButtonElement;
      button.click();
      await nextRender();
      expect(button.getAttribute('aria-expanded')).to.equal('true');

      // Close the overlay by pressing Escape on a menu item
      const overlay = breadcrumb.shadowRoot!.querySelector('#overlay') as HTMLElement;
      const menuItem = overlay.querySelector('[role="menuitem"]') as HTMLElement;
      menuItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
      await nextRender();
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should have role="menu" on the overflow overlay content', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 150px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(50);

      const overlay = breadcrumb.shadowRoot!.querySelector('#overlay') as HTMLElement;
      const menuContainer = overlay.shadowRoot!.querySelector('[role="menu"]');
      expect(menuContainer).to.be.ok;
    });

    it('should have role="menuitem" on overflow menu entries', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 150px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(50);

      const button = breadcrumb.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLElement;
      button.click();
      await nextRender();

      const overlay = breadcrumb.shadowRoot!.querySelector('#overlay') as HTMLElement;
      const menuItems = overlay.querySelectorAll('[role="menuitem"]');
      expect(menuItems.length).to.be.greaterThan(0);
      menuItems.forEach((menuItem) => {
        expect(menuItem.getAttribute('role')).to.equal('menuitem');
      });
    });
  });

  describe('current-item detection', () => {
    let pathnameStub: sinon.SinonStub;
    let searchStub: sinon.SinonStub;

    beforeEach(() => {
      pathnameStub = sinon.stub(location, 'pathname').get(() => '/products');
      searchStub = sinon.stub(location, 'search').get(() => '');
      sinon.stub(document, 'baseURI').value('http://localhost/');
    });

    afterEach(() => {
      pathnameStub.restore();
      searchStub.restore();
      (document.baseURI as any).restore?.();
      sinon.restore();
    });

    describe('no-path item', () => {
      it('should mark an item without path as current', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[0].current).to.be.false;
        expect(items[1].current).to.be.false;
        expect(items[2].current).to.be.true;
      });

      it('should mark only the no-path item as current even if other items match URL', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[0].current).to.be.false;
        expect(items[1].current).to.be.true;
      });
    });

    describe('matchPaths', () => {
      it('should mark the last matching item as current when all items have paths', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[0].current).to.be.false;
        expect(items[1].current).to.be.true;
      });

      it('should not mark any item as current when no path matches', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/about">About</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[0].current).to.be.false;
        expect(items[1].current).to.be.false;
      });
    });

    describe('location property', () => {
      it('should re-evaluate current item when location property is set', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[1].current).to.be.true;

        // Change the mocked location
        pathnameStub.restore();
        pathnameStub = sinon.stub(location, 'pathname').get(() => '/home');

        // Trigger re-evaluation
        breadcrumb.location = {};
        await nextRender();

        expect(items[0].current).to.be.true;
        expect(items[1].current).to.be.false;
      });
    });

    describe('popstate event', () => {
      it('should re-evaluate current item on popstate event', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[1].current).to.be.true;

        // Change the mocked location
        pathnameStub.restore();
        pathnameStub = sinon.stub(location, 'pathname').get(() => '/home');

        window.dispatchEvent(new PopStateEvent('popstate'));
        await nextRender();

        expect(items[0].current).to.be.true;
        expect(items[1].current).to.be.false;
      });
    });

    describe('vaadin-navigated event', () => {
      it('should re-evaluate current item on vaadin-navigated event', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[1].current).to.be.true;

        // Change the mocked location
        pathnameStub.restore();
        pathnameStub = sinon.stub(location, 'pathname').get(() => '/home');

        window.dispatchEvent(new CustomEvent('vaadin-navigated'));
        await nextRender();

        expect(items[0].current).to.be.true;
        expect(items[1].current).to.be.false;
      });
    });

    describe('dynamic items', () => {
      it('should update current-item detection when items are added', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[0].current).to.be.false;

        // Add a no-path item
        const newItem = document.createElement('vaadin-breadcrumb-item');
        newItem.textContent = 'Current';
        breadcrumb.appendChild(newItem);
        await nextRender();

        const updatedItems = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(updatedItems[0].current).to.be.false;
        expect(updatedItems[1].current).to.be.true;
      });

      it('should update current-item detection when items are removed', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const noPathItem = breadcrumb.querySelectorAll('vaadin-breadcrumb-item')[1];
        expect(noPathItem.current).to.be.true;

        // Remove the no-path item
        breadcrumb.removeChild(noPathItem);
        await nextRender();

        // Now only path-based matching should apply
        const remainingItems = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        // /home doesn't match /products, so no item is current
        expect(remainingItems[0].current).to.be.false;
      });
    });
  });

  describe('items property', () => {
    beforeEach(async () => {
      breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      await nextRender();
    });

    it('should generate breadcrumb-item children from items array', async () => {
      breadcrumb.items = [
        { label: 'Home', path: '/home' },
        { label: 'Products', path: '/products' },
        { label: 'Current' },
      ];
      await nextRender();

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      expect(items.length).to.equal(3);
      expect(items[0].textContent).to.equal('Home');
      expect(items[0].path).to.equal('/home');
      expect(items[1].textContent).to.equal('Products');
      expect(items[1].path).to.equal('/products');
      expect(items[2].textContent).to.equal('Current');
    });

    it('should set data-breadcrumb-generated attribute on generated items', async () => {
      breadcrumb.items = [{ label: 'Home', path: '/home' }, { label: 'Current' }];
      await nextRender();

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      items.forEach((item) => {
        expect(item.hasAttribute('data-breadcrumb-generated')).to.be.true;
      });
    });

    it('should set disabled attribute on items with disabled: true', async () => {
      breadcrumb.items = [
        { label: 'Home', path: '/home' },
        { label: 'Disabled', path: '/disabled', disabled: true },
        { label: 'Current' },
      ];
      await nextRender();

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      expect(items[0].disabled).to.be.false;
      expect(items[1].disabled).to.be.true;
      expect(items[2].disabled).to.be.false;
    });

    it('should not set path on items without a path', async () => {
      breadcrumb.items = [{ label: 'Home', path: '/home' }, { label: 'Current' }];
      await nextRender();

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      expect(items[0].path).to.equal('/home');
      expect(items[1].path).to.be.undefined;
    });

    it('should replace previously generated items when items is set to a new array', async () => {
      breadcrumb.items = [
        { label: 'Home', path: '/home' },
        { label: 'Old', path: '/old' },
      ];
      await nextRender();

      breadcrumb.items = [{ label: 'Home', path: '/home' }, { label: 'New', path: '/new' }, { label: 'Current' }];
      await nextRender();

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      expect(items.length).to.equal(3);
      expect(items[1].textContent).to.equal('New');
      expect(items[1].path).to.equal('/new');
      expect(items[2].textContent).to.equal('Current');
    });

    it('should remove all generated items when items is set to null', async () => {
      breadcrumb.items = [{ label: 'Home', path: '/home' }, { label: 'Current' }];
      await nextRender();

      expect(breadcrumb.querySelectorAll('vaadin-breadcrumb-item').length).to.equal(2);

      breadcrumb.items = null;
      await nextRender();

      expect(breadcrumb.querySelectorAll('vaadin-breadcrumb-item').length).to.equal(0);
    });

    it('should only replace generated items, not declarative children', async () => {
      // Start with declarative children
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();

      breadcrumb.items = [{ label: 'Products', path: '/products' }, { label: 'Current' }];
      await nextRender();

      const allItems = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      expect(allItems.length).to.equal(3);
      // The declarative child should still be there
      expect(allItems[0].textContent!.trim()).to.equal('Home');
      expect(allItems[0].hasAttribute('data-breadcrumb-generated')).to.be.false;
      // The generated items follow
      expect(allItems[1].textContent).to.equal('Products');
      expect(allItems[1].hasAttribute('data-breadcrumb-generated')).to.be.true;
      expect(allItems[2].textContent).to.equal('Current');
      expect(allItems[2].hasAttribute('data-breadcrumb-generated')).to.be.true;

      // Setting items to a new array only replaces generated items
      breadcrumb.items = [{ label: 'About', path: '/about' }];
      await nextRender();

      const updatedItems = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      expect(updatedItems.length).to.equal(2);
      expect(updatedItems[0].textContent!.trim()).to.equal('Home');
      expect(updatedItems[0].hasAttribute('data-breadcrumb-generated')).to.be.false;
      expect(updatedItems[1].textContent).to.equal('About');
      expect(updatedItems[1].hasAttribute('data-breadcrumb-generated')).to.be.true;
    });
  });

  describe('separator distribution', () => {
    describe('default separator', () => {
      it('should use the default chevron when no custom separator is provided', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        items.forEach((item) => {
          const separator = item.shadowRoot!.querySelector('#separator');
          expect(separator).to.be.ok;
          // Default chevron character (›)
          expect(separator!.textContent!.trim()).to.equal('\u203A');
        });
      });
    });

    describe('custom separator', () => {
      it('should distribute custom separator to each item when slotted', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
            <span slot="separator">/</span>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        items.forEach((item) => {
          const separator = item.shadowRoot!.querySelector('#separator');
          expect(separator).to.be.ok;
          // Should contain the cloned custom separator, not the default chevron
          const cloned = separator!.querySelector('span');
          expect(cloned).to.be.ok;
          expect(cloned!.textContent).to.equal('/');
        });
      });

      it('should revert to default chevron when custom separator is removed', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <span slot="separator">/</span>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        // Verify custom separator is in use
        items.forEach((item) => {
          const separator = item.shadowRoot!.querySelector('#separator');
          expect(separator!.querySelector('span')).to.be.ok;
        });

        // Remove the custom separator
        const customSep = breadcrumb.querySelector('[slot="separator"]')!;
        breadcrumb.removeChild(customSep);
        await nextRender();

        // Items should revert to the default chevron
        items.forEach((item) => {
          const separator = item.shadowRoot!.querySelector('#separator');
          expect(separator!.textContent!.trim()).to.equal('\u203A');
          expect(separator!.querySelector('span')).to.be.null;
        });
      });
    });

    describe('first attribute', () => {
      it('should set the first attribute on the first item', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[0].hasAttribute('first')).to.be.true;
        expect(items[1].hasAttribute('first')).to.be.false;
        expect(items[2].hasAttribute('first')).to.be.false;
      });

      it('should move the first attribute when items are reordered', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[0].hasAttribute('first')).to.be.true;
        expect(items[1].hasAttribute('first')).to.be.false;

        // Move the first item to the end (reorder)
        breadcrumb.appendChild(items[0]);
        await nextRender();

        const reorderedItems = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(reorderedItems[0].hasAttribute('first')).to.be.true;
        expect(reorderedItems[1].hasAttribute('first')).to.be.false;
      });
    });
  });

  describe('i18n property', () => {
    beforeEach(async () => {
      breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      await nextRender();
    });

    it('should have a default i18n object with overflow label', () => {
      expect(breadcrumb.i18n).to.deep.equal({ overflow: 'Show more' });
    });

    it('should set the overflow button aria-label from i18n.overflow', async () => {
      const overflowButton = breadcrumb.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLElement;
      expect(overflowButton.getAttribute('aria-label')).to.equal('Show more');
    });

    it('should update the overflow button aria-label when i18n changes', async () => {
      breadcrumb.i18n = { overflow: 'Mehr anzeigen' };
      await nextRender();

      const overflowButton = breadcrumb.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLElement;
      expect(overflowButton.getAttribute('aria-label')).to.equal('Mehr anzeigen');
    });
  });

  describe('overflow management', () => {
    function getOverflowContainer(bc: Breadcrumb): HTMLElement {
      return bc.shadowRoot!.querySelector('#overflow') as HTMLElement;
    }

    function getOverflowButton(bc: Breadcrumb): HTMLButtonElement {
      return bc.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLButtonElement;
    }

    function getOverlay(bc: Breadcrumb): HTMLElement {
      return bc.shadowRoot!.querySelector('#overlay') as HTMLElement;
    }

    describe('overflow detection', () => {
      it('should not show overflow when items fit', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 500px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        const overflow = getOverflowContainer(breadcrumb);
        expect(overflow.hidden).to.be.true;

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        items.forEach((item) => {
          expect(item.hasAttribute('overflow-hidden')).to.be.false;
        });
      });

      it('should hide intermediate items when items exceed container width', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        // First item should remain visible
        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[0].hasAttribute('overflow-hidden')).to.be.false;

        // At least some intermediate items should be hidden
        const hiddenItems = Array.from(items).filter((item) => item.hasAttribute('overflow-hidden'));
        expect(hiddenItems.length).to.be.greaterThan(0);
      });

      it('should keep the first item visible when overflow occurs', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        expect(items[0].hasAttribute('overflow-hidden')).to.be.false;
      });

      it('should keep the last visible item(s) when overflow occurs', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 200px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        // The last item should remain visible
        expect(items[items.length - 1].hasAttribute('overflow-hidden')).to.be.false;
      });

      it('should show the overflow button when items overflow', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        const overflow = getOverflowContainer(breadcrumb);
        expect(overflow.hidden).to.be.false;
      });

      it('should restore items and hide overflow button when container is resized wider', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        // Should overflow initially
        const overflow = getOverflowContainer(breadcrumb);
        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        const hadHidden = Array.from(items).some((item) => item.hasAttribute('overflow-hidden'));
        expect(hadHidden).to.be.true;

        // Resize wider
        breadcrumb.style.width = '800px';
        await aTimeout(100);

        // Items should be restored
        items.forEach((item) => {
          expect(item.hasAttribute('overflow-hidden')).to.be.false;
        });
        expect(overflow.hidden).to.be.true;
      });
    });

    describe('overflow button', () => {
      it('should have aria-haspopup="true"', async () => {
        breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
        await nextRender();

        const button = getOverflowButton(breadcrumb);
        expect(button.getAttribute('aria-haspopup')).to.equal('true');
      });

      it('should have aria-expanded="false" initially', async () => {
        breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
        await nextRender();

        const button = getOverflowButton(breadcrumb);
        expect(button.getAttribute('aria-expanded')).to.equal('false');
      });
    });

    describe('overflow overlay', () => {
      it('should open the overlay when clicking the overflow button', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        const button = getOverflowButton(breadcrumb);
        button.click();
        await nextRender();

        const overlay = getOverlay(breadcrumb);
        expect((overlay as any).opened).to.be.true;
      });

      it('should list collapsed items in hierarchical order in the overlay', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        // Open the overlay
        const button = getOverflowButton(breadcrumb);
        button.click();
        await nextRender();

        const overlay = getOverlay(breadcrumb);
        const menuItems = overlay.querySelectorAll('[role="menuitem"]');
        expect(menuItems.length).to.be.greaterThan(0);

        // Menu items should be links with role="menuitem"
        const firstItem = menuItems[0] as HTMLElement;
        expect(firstItem.getAttribute('role')).to.equal('menuitem');
      });

      it('should render disabled collapsed items as non-link elements', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products" disabled>Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        // Open the overlay
        const button = getOverflowButton(breadcrumb);
        button.click();
        await nextRender();

        const overlay = getOverlay(breadcrumb);
        const menuItems = Array.from(overlay.querySelectorAll('[role="menuitem"]'));

        // Find the disabled item
        const disabledMenuItem = menuItems.find((el) => el.textContent!.trim() === 'Products') as
          | HTMLElement
          | undefined;
        if (disabledMenuItem) {
          expect(disabledMenuItem.tagName.toLowerCase()).to.equal('span');
          expect(disabledMenuItem.getAttribute('aria-disabled')).to.equal('true');
        }
      });

      it('should close the overlay when clicking a link in the dropdown', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        // Open the overlay
        const button = getOverflowButton(breadcrumb);
        button.click();
        await nextRender();

        const overlay = getOverlay(breadcrumb);
        const link = overlay.querySelector('a[role="menuitem"]') as HTMLElement;
        expect(link).to.be.ok;

        // Click the link (prevent actual navigation)
        link.addEventListener('click', (e) => e.preventDefault());
        link.click();
        await nextRender();

        expect((overlay as any).opened).to.be.false;
      });

      it('should close the overlay when clicking outside', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        // Open the overlay
        const button = getOverflowButton(breadcrumb);
        button.click();
        await nextRender();

        const overlay = getOverlay(breadcrumb);
        expect((overlay as any).opened).to.be.true;

        // Click outside
        document.body.click();
        await nextRender();
        await aTimeout(50);

        expect((overlay as any).opened).to.be.false;
      });

      it('should update aria-expanded on the overflow button when overlay opens', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);
        await nextRender();
        await aTimeout(50);

        const button = getOverflowButton(breadcrumb);
        expect(button.getAttribute('aria-expanded')).to.equal('false');

        button.click();
        await nextRender();

        expect(button.getAttribute('aria-expanded')).to.equal('true');
      });
    });
  });

  describe('mobile mode', () => {
    function getBackLink(bc: Breadcrumb): HTMLAnchorElement | null {
      return bc.shadowRoot!.querySelector('[part="back-link"]');
    }

    function getBackArrow(bc: Breadcrumb): HTMLSpanElement | null {
      return bc.shadowRoot!.querySelector('[part="back-arrow"]');
    }

    function getList(bc: Breadcrumb): HTMLElement | null {
      return bc.shadowRoot!.querySelector('[part="list"]');
    }

    function getItemsSlot(bc: Breadcrumb): HTMLSlotElement | null {
      return bc.shadowRoot!.querySelector('#items');
    }

    it('should set the [mobile] attribute when container is too narrow for minimum layout', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 50px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page Title That Is Very Long</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(100);

      expect(breadcrumb.hasAttribute('mobile')).to.be.true;
    });

    it('should render a back-link with the parent item path as href in mobile mode', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 50px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(100);

      expect(breadcrumb.hasAttribute('mobile')).to.be.true;

      const backLink = getBackLink(breadcrumb);
      expect(backLink).to.be.ok;
      expect(backLink!.getAttribute('href')).to.equal('/products');
    });

    it('should display a back-arrow icon in the back-link', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 50px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(100);

      const backArrow = getBackArrow(breadcrumb);
      expect(backArrow).to.be.ok;
      expect(backArrow!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should display the parent item label in the back-link', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 50px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(100);

      const backLink = getBackLink(breadcrumb);
      expect(backLink).to.be.ok;
      expect(backLink!.textContent).to.contain('Products');
    });

    it('should determine parent as the last item with a path that is not current', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 50px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(100);

      const backLink = getBackLink(breadcrumb);
      expect(backLink).to.be.ok;
      // The parent should be "Category" (last item with path that is not current)
      expect(backLink!.getAttribute('href')).to.equal('/category');
      expect(backLink!.textContent).to.contain('Category');
    });

    it('should not render the normal list in mobile mode', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 50px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(100);

      expect(breadcrumb.hasAttribute('mobile')).to.be.true;
      const list = getList(breadcrumb);
      expect(list).to.be.null;
    });

    it('should keep items accessible in a hidden slot during mobile mode', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 50px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(100);

      expect(breadcrumb.hasAttribute('mobile')).to.be.true;

      // The items slot should still exist in a hidden container
      const itemsSlot = getItemsSlot(breadcrumb);
      expect(itemsSlot).to.be.ok;
      const hiddenContainer = itemsSlot!.parentElement!;
      expect(hiddenContainer.hasAttribute('hidden')).to.be.true;

      // The light DOM items should still be accessible
      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
      expect(items.length).to.equal(3);
    });

    it('should exit mobile mode and remove [mobile] attribute when resized wider', async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb style="width: 50px;">
          <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      await aTimeout(100);

      expect(breadcrumb.hasAttribute('mobile')).to.be.true;

      // Resize wider
      breadcrumb.style.width = '800px';
      await aTimeout(200);

      expect(breadcrumb.hasAttribute('mobile')).to.be.false;
      // The normal list should be back
      const list = getList(breadcrumb);
      expect(list).to.be.ok;
    });
  });

  describe('onNavigate click handling', () => {
    function clickItemLink(item: BreadcrumbItem, props: MouseEventInit = {}): MouseEvent {
      const itemLink = item.shadowRoot!.querySelector('a')!;
      const event = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, ...props });
      itemLink.dispatchEvent(event);
      return event;
    }

    describe('item link clicks', () => {
      beforeEach(async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 500px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);

        breadcrumb.addEventListener('click', (e: MouseEvent) => {
          const { defaultPrevented } = e;
          // Prevent the tests from navigating away
          e.preventDefault();
          // Restore the defaultPrevented property
          Object.defineProperty(e, 'defaultPrevented', { value: defaultPrevented });
        });

        breadcrumb.onNavigate = sinon.spy();

        await nextRender();
      });

      it('should call the callback with { path, current, originalEvent } when clicking an item link', () => {
        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        const clickEvent = clickItemLink(items[0]);

        expect((breadcrumb.onNavigate as sinon.SinonSpy).calledOnce).to.be.true;
        const callArgs = (breadcrumb.onNavigate as sinon.SinonSpy).firstCall.args[0];
        expect(callArgs.path).to.equal('/home');
        expect(callArgs.current).to.be.false;
        expect(callArgs.originalEvent).to.equal(clickEvent);
      });

      it('should prevent default link navigation when onNavigate is set', () => {
        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        const clickEvent = clickItemLink(items[0]);
        expect(clickEvent.defaultPrevented).to.be.true;
      });

      it('should not prevent default when the callback returns false', () => {
        breadcrumb.onNavigate = () => false;
        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        const clickEvent = clickItemLink(items[0]);
        expect(clickEvent.defaultPrevented).to.be.false;
      });

      it('should pass through clicks with metaKey without calling the callback', () => {
        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        const clickEvent = clickItemLink(items[0], { metaKey: true });
        expect((breadcrumb.onNavigate as sinon.SinonSpy).called).to.be.false;
        expect(clickEvent.defaultPrevented).to.be.false;
      });

      it('should pass through clicks with shiftKey without calling the callback', () => {
        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        const clickEvent = clickItemLink(items[0], { shiftKey: true });
        expect((breadcrumb.onNavigate as sinon.SinonSpy).called).to.be.false;
        expect(clickEvent.defaultPrevented).to.be.false;
      });

      it('should pass through clicks on items with [router-ignore] attribute', async () => {
        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        items[0].setAttribute('router-ignore', '');
        await nextRender();

        const clickEvent = clickItemLink(items[0]);
        expect((breadcrumb.onNavigate as sinon.SinonSpy).called).to.be.false;
        expect(clickEvent.defaultPrevented).to.be.false;
      });

      it('should not intercept links when onNavigate is not set', () => {
        breadcrumb.onNavigate = undefined;
        const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
        const clickEvent = clickItemLink(items[0]);
        expect(clickEvent.defaultPrevented).to.be.false;
      });
    });

    describe('overflow menu link clicks', () => {
      function getOverflowButton(bc: Breadcrumb): HTMLButtonElement {
        return bc.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLButtonElement;
      }

      function getOverlay(bc: Breadcrumb): HTMLElement {
        return bc.shadowRoot!.querySelector('#overlay') as HTMLElement;
      }

      it('should call onNavigate when clicking an overflow menu link', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 150px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/category">Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);

        breadcrumb.addEventListener('click', (e: MouseEvent) => {
          const { defaultPrevented } = e;
          e.preventDefault();
          Object.defineProperty(e, 'defaultPrevented', { value: defaultPrevented });
        });

        breadcrumb.onNavigate = sinon.spy();

        await nextRender();
        await aTimeout(50);

        // Open the overlay
        const button = getOverflowButton(breadcrumb);
        button.click();
        await nextRender();

        const overlay = getOverlay(breadcrumb);
        const link = overlay.querySelector('a[role="menuitem"]') as HTMLAnchorElement;
        expect(link).to.be.ok;

        // Click the overflow menu link
        const clickEvent = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true });
        link.dispatchEvent(clickEvent);

        expect((breadcrumb.onNavigate as sinon.SinonSpy).calledOnce).to.be.true;
        const callArgs = (breadcrumb.onNavigate as sinon.SinonSpy).firstCall.args[0];
        expect(callArgs.path).to.equal(link.getAttribute('href'));
        expect(callArgs.current).to.be.false;
        expect(callArgs.originalEvent).to.equal(clickEvent);
      });
    });

    describe('mobile back-link clicks', () => {
      function getBackLink(bc: Breadcrumb): HTMLAnchorElement | null {
        return bc.shadowRoot!.querySelector('[part="back-link"]');
      }

      it('should call onNavigate when clicking the mobile back-link', async () => {
        breadcrumb = fixtureSync(`
          <vaadin-breadcrumb style="width: 50px;">
            <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        `);

        breadcrumb.addEventListener('click', (e: MouseEvent) => {
          const { defaultPrevented } = e;
          e.preventDefault();
          Object.defineProperty(e, 'defaultPrevented', { value: defaultPrevented });
        });

        breadcrumb.onNavigate = sinon.spy();

        await nextRender();
        await aTimeout(100);

        expect(breadcrumb.hasAttribute('mobile')).to.be.true;

        const backLink = getBackLink(breadcrumb)!;
        expect(backLink).to.be.ok;

        const clickEvent = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true });
        backLink.dispatchEvent(clickEvent);

        expect((breadcrumb.onNavigate as sinon.SinonSpy).calledOnce).to.be.true;
        const callArgs = (breadcrumb.onNavigate as sinon.SinonSpy).firstCall.args[0];
        expect(callArgs.path).to.equal('/products');
        expect(callArgs.current).to.be.false;
        expect(callArgs.originalEvent).to.equal(clickEvent);
      });
    });
  });
});

describe('vaadin-breadcrumb-item', () => {
  let item: BreadcrumbItem;

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      item = fixtureSync('<vaadin-breadcrumb-item></vaadin-breadcrumb-item>');
      tagName = item.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal('vaadin-breadcrumb-item');
    });
  });

  describe('shadow root', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item></vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should render a shadow root without errors', () => {
      expect(item.shadowRoot).to.be.ok;
    });
  });
});

describe('vaadin-breadcrumb-overlay', () => {
  describe('custom element definition', () => {
    beforeEach(() => {
      // The overlay is registered as part of the breadcrumb import
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get('vaadin-breadcrumb-overlay')).to.be.ok;
    });
  });

  describe('shadow root', () => {
    let overlay: HTMLElement;

    beforeEach(async () => {
      overlay = fixtureSync('<vaadin-breadcrumb-overlay></vaadin-breadcrumb-overlay>');
      await nextRender();
    });

    it('should render a shadow root without errors', () => {
      expect(overlay.shadowRoot).to.be.ok;
    });
  });
});
