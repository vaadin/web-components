import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumb.js';
import type { Breadcrumb } from '../vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../vaadin-breadcrumb.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

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
      element = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
    });

    it('should have role="navigation" on the host', () => {
      expect(element.getAttribute('role')).to.equal('navigation');
    });

    it('should not override a custom role', async () => {
      const el = fixtureSync('<vaadin-breadcrumb role="nav"></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();
      expect(el.getAttribute('role')).to.equal('nav');
    });

    it('should set aria-current="page" on the last item when it has no path', () => {
      const items = element.querySelectorAll('vaadin-breadcrumb-item');
      expect(items[0].getAttribute('aria-current')).to.be.null;
      expect(items[1].getAttribute('aria-current')).to.be.null;
      expect(items[2].getAttribute('aria-current')).to.equal('page');
    });

    it('should not set aria-current on the last item when it has a path', async () => {
      const el = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();
      const items = el.querySelectorAll('vaadin-breadcrumb-item');
      expect(items[0].getAttribute('aria-current')).to.be.null;
      expect(items[1].getAttribute('aria-current')).to.be.null;
    });
  });

  describe('label property', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      await nextRender();
    });

    it('should not have aria-label by default', () => {
      expect(element.hasAttribute('aria-label')).to.be.false;
    });

    it('should set aria-label when label property is set', async () => {
      element.label = 'Breadcrumb';
      await nextUpdate(element);
      expect(element.getAttribute('aria-label')).to.equal('Breadcrumb');
    });

    it('should remove aria-label when label is cleared', async () => {
      element.label = 'Breadcrumb';
      await nextUpdate(element);
      element.label = undefined as any;
      await nextUpdate(element);
      expect(element.hasAttribute('aria-label')).to.be.false;
    });
  });

  describe('items property', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>');
      await nextRender();
    });

    it('should generate breadcrumb-item elements from items array', async () => {
      element.items = [{ text: 'Home', path: '/' }, { text: 'Products', path: '/products' }, { text: 'Current' }];
      await nextUpdate(element);
      await nextRender();
      const items = element.querySelectorAll('vaadin-breadcrumb-item');
      expect(items.length).to.equal(3);
      expect(items[0].textContent!.trim()).to.equal('Home');
      expect(items[0].path).to.equal('/');
      expect(items[1].textContent!.trim()).to.equal('Products');
      expect(items[1].path).to.equal('/products');
      expect(items[2].textContent!.trim()).to.equal('Current');
      expect(items[2].path).to.be.undefined;
    });

    it('should set disabled on generated items', async () => {
      element.items = [
        { text: 'Home', path: '/' },
        { text: 'Disabled', path: '/x', disabled: true },
        { text: 'Current' },
      ];
      await nextUpdate(element);
      await nextRender();
      const items = element.querySelectorAll('vaadin-breadcrumb-item');
      expect(items[1].disabled).to.be.true;
    });

    it('should set aria-current on the last generated item without path', async () => {
      element.items = [{ text: 'Home', path: '/' }, { text: 'Current' }];
      await nextUpdate(element);
      await nextRender();
      const items = element.querySelectorAll('vaadin-breadcrumb-item');
      expect(items[1].getAttribute('aria-current')).to.equal('page');
    });

    it('should remove generated items when items is set to undefined', async () => {
      element.items = [{ text: 'Home', path: '/' }, { text: 'Current' }];
      await nextUpdate(element);
      await nextRender();
      expect(element.querySelectorAll('vaadin-breadcrumb-item').length).to.equal(2);

      element.items = undefined as any;
      await nextUpdate(element);
      expect(element.querySelectorAll('vaadin-breadcrumb-item').length).to.equal(0);
    });

    it('should replace generated items when items is updated', async () => {
      element.items = [{ text: 'A' }, { text: 'B' }];
      await nextUpdate(element);
      await nextRender();
      expect(element.querySelectorAll('vaadin-breadcrumb-item').length).to.equal(2);

      element.items = [{ text: 'X' }, { text: 'Y' }, { text: 'Z' }];
      await nextUpdate(element);
      await nextRender();
      const items = element.querySelectorAll('vaadin-breadcrumb-item');
      expect(items.length).to.equal(3);
      expect(items[0].textContent!.trim()).to.equal('X');
    });
  });

  describe('shadow DOM structure', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
    });

    it('should have an ordered list with part="list"', () => {
      const list = element.shadowRoot!.querySelector('ol[part="list"]');
      expect(list).to.be.ok;
    });

    it('should have a slot inside the list', () => {
      const slot = element.shadowRoot!.querySelector('ol[part="list"] slot');
      expect(slot).to.be.ok;
    });

    it('should not have a <nav> element in shadow DOM', () => {
      const nav = element.shadowRoot!.querySelector('nav');
      expect(nav).to.be.null;
    });

    it('should have an overflow button with part="overflow"', () => {
      const overflow = element.shadowRoot!.querySelector('[part="overflow"]');
      expect(overflow).to.be.ok;
    });

    it('should have the overflow button hidden by default', () => {
      const overflow = element.shadowRoot!.querySelector('[part="overflow"]');
      expect(overflow!.hidden).to.be.true;
    });

    it('should have a popover element', () => {
      const popover = element.shadowRoot!.querySelector('vaadin-popover');
      expect(popover).to.be.ok;
    });
  });

  describe('overflow', () => {
    beforeEach(async () => {
      const wrapper = fixtureSync('<div style="width: 300px"></div>') as HTMLDivElement;
      wrapper.innerHTML = `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products/widgets">Widgets</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products/widgets/sprockets">Sprockets</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Turbo Sprocket</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `;
      element = wrapper.querySelector('vaadin-breadcrumb') as Breadcrumb;
      await nextRender();
      // Wait for ResizeObserver callback
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it('should show overflow button when items do not fit', () => {
      const overflow = element.shadowRoot!.querySelector('[part="overflow"]') as HTMLElement;
      expect(overflow.hidden).to.be.false;
    });

    it('should hide some items when overflow is active', () => {
      const items = element.querySelectorAll('vaadin-breadcrumb-item');
      const hiddenItems = [...items].filter((item) => item.hasAttribute('hidden'));
      expect(hiddenItems.length).to.be.greaterThan(0);
    });

    it('should always show the current page (last item)', () => {
      const items = element.querySelectorAll('vaadin-breadcrumb-item');
      const lastItem = items[items.length - 1];
      expect(lastItem.hasAttribute('hidden')).to.be.false;
    });

    it('should show all items when there is enough space', async () => {
      (element.parentElement as HTMLElement).style.width = '800px';
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      const items = element.querySelectorAll('vaadin-breadcrumb-item');
      const hiddenItems = [...items].filter((item) => item.hasAttribute('hidden'));
      expect(hiddenItems.length).to.equal(0);
      const overflow = element.shadowRoot!.querySelector('[part="overflow"]') as HTMLElement;
      expect(overflow.hidden).to.be.true;
    });

    it('should collapse items progressively one at a time', async () => {
      // Use items with longer labels to make the width differences significant
      const wrapper = element.parentElement as HTMLElement;
      wrapper.innerHTML = `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/b">Category One</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/c">Category Two</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/d">Parent Page</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `;
      element = wrapper.querySelector('vaadin-breadcrumb') as Breadcrumb;
      await nextRender();

      // First, expand to find the natural width and verify all visible
      wrapper.style.width = '800px';
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      const items = element.querySelectorAll('vaadin-breadcrumb-item');
      expect([...items].filter((i) => i.hasAttribute('hidden')).length).to.equal(0);

      // Now shrink progressively and track the collapse sequence.
      // The first item to be hidden should always be "Category One" (index 1),
      // then "Category Two" (index 2), never both at the same time.
      let firstHidden: string | null = null;
      for (let width = 700; width >= 100; width -= 10) {
        wrapper.style.width = `${width}px`;

        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
        const hidden = [...items].filter((i) => i.hasAttribute('hidden'));
        if (hidden.length > 0 && !firstHidden) {
          firstHidden = hidden[0].textContent!.trim();
          // When overflow first triggers, only 1 middle item should be hidden
          expect(hidden.length).to.equal(1);
          break;
        }
      }

      expect(firstHidden).to.equal('Category One');
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
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('properties', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item></vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should have path property undefined by default', () => {
      expect(item.path).to.be.undefined;
    });

    it('should reflect path to attribute', async () => {
      item.path = '/test';
      await nextUpdate(item);
      expect(item.getAttribute('path')).to.equal('/test');
    });

    it('should set has-path attribute when path is set', async () => {
      item.path = '/test';
      await nextUpdate(item);
      expect(item.hasAttribute('has-path')).to.be.true;
    });

    it('should remove has-path attribute when path is removed', async () => {
      item.path = '/test';
      await nextUpdate(item);
      item.path = undefined as any;
      await nextUpdate(item);
      expect(item.hasAttribute('has-path')).to.be.false;
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item></vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should have role="listitem"', () => {
      expect(item.getAttribute('role')).to.equal('listitem');
    });
  });

  describe('rendering', () => {
    it('should render an anchor when path is set', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>');
      await nextRender();
      const link = item.shadowRoot!.querySelector('a[part="link"]');
      expect(link).to.be.ok;
      expect(link!.getAttribute('href')).to.equal('/products');
    });

    it('should render a span when path is not set', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>');
      await nextRender();
      const span = item.shadowRoot!.querySelector('span[part="link"]');
      expect(span).to.be.ok;
      const anchor = item.shadowRoot!.querySelector('a');
      expect(anchor).to.be.null;
    });

    it('should have a prefix slot', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>');
      await nextRender();
      const slot = item.shadowRoot!.querySelector('slot[name="prefix"]');
      expect(slot).to.be.ok;
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/products" disabled>Products</vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should set aria-disabled on the link', () => {
      const link = item.shadowRoot!.querySelector('a[part="link"]');
      expect(link!.getAttribute('aria-disabled')).to.equal('true');
    });

    it('should not set href on the link when disabled', () => {
      const link = item.shadowRoot!.querySelector('a[part="link"]');
      expect(link!.hasAttribute('href')).to.be.false;
    });
  });
});
