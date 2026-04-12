import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
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
