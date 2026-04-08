import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumb.js';
import type { Breadcrumb } from '../vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../vaadin-breadcrumb.js';

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
