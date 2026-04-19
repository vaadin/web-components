import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-breadcrumb.js';
import type { Breadcrumb } from '../src/vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../src/vaadin-breadcrumb-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('vaadin-breadcrumb accessibility', () => {
  describe('navigation landmark', () => {
    let breadcrumb: Breadcrumb;

    beforeEach(async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
    });

    it('should have role="navigation" on the host element', () => {
      expect(breadcrumb.getAttribute('role')).to.equal('navigation');
    });

    it('should have aria-label="Breadcrumb" by default', () => {
      expect(breadcrumb.getAttribute('aria-label')).to.equal('Breadcrumb');
    });

    it('should have role="list" on the shadow container', () => {
      const container = breadcrumb.shadowRoot!.querySelector('[part="container"]');
      expect(container!.getAttribute('role')).to.equal('list');
    });

    it('should update aria-label when label property changes', async () => {
      breadcrumb.label = 'File navigation';
      await nextRender();
      expect(breadcrumb.getAttribute('aria-label')).to.equal('File navigation');
    });
  });

  describe('current item aria-current', () => {
    let breadcrumb: Breadcrumb;
    let items: NodeListOf<BreadcrumbItem>;

    beforeEach(async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    });

    it('should set aria-current="page" on the current item link', () => {
      const link = items[2].shadowRoot!.querySelector('a')!;
      expect(link.getAttribute('aria-current')).to.equal('page');
    });

    it('should set aria-current="false" on non-current item links', () => {
      const link0 = items[0].shadowRoot!.querySelector('a')!;
      const link1 = items[1].shadowRoot!.querySelector('a')!;
      expect(link0.getAttribute('aria-current')).to.equal('false');
      expect(link1.getAttribute('aria-current')).to.equal('false');
    });
  });

  describe('tab order without overflow', () => {
    let breadcrumb: Breadcrumb;
    let items: NodeListOf<BreadcrumbItem>;

    beforeEach(async () => {
      breadcrumb = fixtureSync(`
        <div style="width: 2000px;">
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        </div>
      `);
      breadcrumb = breadcrumb.querySelector('vaadin-breadcrumb') || (breadcrumb as unknown as Breadcrumb);
      await nextRender();
      items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    });

    it('should have tabindex="0" on item links with a path', () => {
      const link0 = items[0].shadowRoot!.querySelector('a')!;
      const link1 = items[1].shadowRoot!.querySelector('a')!;
      expect(link0.getAttribute('tabindex')).to.equal('0');
      expect(link1.getAttribute('tabindex')).to.equal('0');
    });

    it('should have tabindex="-1" on the current item link', () => {
      const link = items[2].shadowRoot!.querySelector('a')!;
      expect(link.getAttribute('tabindex')).to.equal('-1');
    });

    it('should move focus through visible item links with Tab, skipping current item', async () => {
      // Focus the first item's link
      const link0 = items[0].shadowRoot!.querySelector('a')!;
      link0.focus();
      expect(document.activeElement).to.equal(items[0]);
      expect(items[0].shadowRoot!.activeElement).to.equal(link0);

      // Tab to second link
      await sendKeys({ press: 'Tab' });
      const link1 = items[1].shadowRoot!.querySelector('a')!;
      expect(document.activeElement).to.equal(items[1]);
      expect(items[1].shadowRoot!.activeElement).to.equal(link1);

      // Tab again should skip the current item (tabindex="-1") and leave the breadcrumb
      await sendKeys({ press: 'Tab' });
      // Focus should NOT be on the current item
      expect(document.activeElement).to.not.equal(items[2]);
    });
  });

  describe('tab order with overflow', () => {
    let wrapper: HTMLDivElement;
    let breadcrumb: Breadcrumb;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="width: 200px;">
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/a">Category A</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/a/b">Sub Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/a/b/c">Product Group</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        </div>
      `);
      breadcrumb = wrapper.querySelector('vaadin-breadcrumb')!;
      await nextRender();
      await aTimeout(0);
    });

    it('should include the overflow button in the tab order', () => {
      const overflowButton = breadcrumb.querySelector('[data-overflow]') as HTMLElement;
      expect(overflowButton).to.be.ok;
      expect(overflowButton.getAttribute('tabindex')).to.equal('0');
    });

    it('should place the overflow button between visible items in tab order', async () => {
      const overflowButton = breadcrumb.querySelector('[data-overflow]') as HTMLButtonElement;
      expect(overflowButton).to.be.ok;

      const items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
      // Find the first visible item with a path (should be root)
      const rootItem = items[0];
      expect(rootItem.style.visibility).to.not.equal('hidden');

      // Focus the root item's link
      const rootLink = rootItem.shadowRoot!.querySelector('a')!;
      rootLink.focus();
      expect(items[0].shadowRoot!.activeElement).to.equal(rootLink);

      // Tab should move to the overflow button (it's positioned after the root)
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(overflowButton);
    });
  });

  describe('overflow button keyboard interaction', () => {
    let wrapper: HTMLDivElement;
    let breadcrumb: Breadcrumb;
    let overflowButton: HTMLButtonElement;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="width: 200px;">
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/a">Category A</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/a/b">Sub Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        </div>
      `);
      breadcrumb = wrapper.querySelector('vaadin-breadcrumb')!;
      await nextRender();
      await aTimeout(0);
      overflowButton = breadcrumb.querySelector('[data-overflow]') as HTMLButtonElement;
    });

    it('should open the dropdown when pressing Enter on the overflow button', async () => {
      overflowButton.focus();
      await sendKeys({ press: 'Enter' });

      const dropdown = breadcrumb.shadowRoot!.querySelector('[part="dropdown"]') as HTMLElement;
      expect(dropdown.hasAttribute('hidden')).to.be.false;
    });

    it('should open the dropdown when pressing Space on the overflow button', async () => {
      overflowButton.focus();
      await sendKeys({ press: 'Space' });

      const dropdown = breadcrumb.shadowRoot!.querySelector('[part="dropdown"]') as HTMLElement;
      expect(dropdown.hasAttribute('hidden')).to.be.false;
    });

    it('should set aria-expanded="true" when dropdown opens via keyboard', async () => {
      expect(overflowButton.getAttribute('aria-expanded')).to.equal('false');

      overflowButton.focus();
      await sendKeys({ press: 'Enter' });

      expect(overflowButton.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should close the dropdown and return focus to overflow button on Escape', async () => {
      overflowButton.focus();
      await sendKeys({ press: 'Enter' });

      const dropdown = breadcrumb.shadowRoot!.querySelector('[part="dropdown"]') as HTMLElement;
      expect(dropdown.hasAttribute('hidden')).to.be.false;

      await sendKeys({ press: 'Escape' });

      expect(dropdown.hasAttribute('hidden')).to.be.true;
      expect(document.activeElement).to.equal(overflowButton);
    });
  });

  describe('dropdown keyboard navigation', () => {
    let wrapper: HTMLDivElement;
    let breadcrumb: Breadcrumb;
    let overflowButton: HTMLButtonElement;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="width: 200px;">
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/a">Category A</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/a/b">Sub Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        </div>
      `);
      breadcrumb = wrapper.querySelector('vaadin-breadcrumb')!;
      await nextRender();
      await aTimeout(0);
      overflowButton = breadcrumb.querySelector('[data-overflow]') as HTMLButtonElement;
    });

    it('should allow Tab to move focus through dropdown links', async () => {
      // Open the dropdown
      overflowButton.focus();
      await sendKeys({ press: 'Enter' });

      const dropdown = breadcrumb.shadowRoot!.querySelector('[part="dropdown"]') as HTMLElement;
      const links = dropdown.querySelectorAll('a');
      expect(links.length).to.be.greaterThan(0);

      // Focus the first link
      links[0].focus();
      expect(breadcrumb.shadowRoot!.activeElement).to.equal(links[0]);

      // Tab to the next link if there are multiple
      if (links.length > 1) {
        await sendKeys({ press: 'Tab' });
        expect(breadcrumb.shadowRoot!.activeElement).to.equal(links[1]);
      }
    });

    it('should have role="list" on the dropdown container', () => {
      const dropdown = breadcrumb.shadowRoot!.querySelector('[part="dropdown"]') as HTMLElement;
      expect(dropdown.getAttribute('role')).to.equal('list');
    });

    it('should set role="listitem" on each dropdown link', () => {
      overflowButton.click();

      const dropdown = breadcrumb.shadowRoot!.querySelector('[part="dropdown"]') as HTMLElement;
      const links = dropdown.querySelectorAll('a');
      for (const link of links) {
        expect(link.getAttribute('role')).to.equal('listitem');
      }
    });
  });

  describe('overflow button accessible name', () => {
    let wrapper: HTMLDivElement;
    let breadcrumb: Breadcrumb;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div style="width: 200px;">
          <vaadin-breadcrumb>
            <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/a">Category A</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item path="/a/b">Sub Category</vaadin-breadcrumb-item>
            <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
          </vaadin-breadcrumb>
        </div>
      `);
      breadcrumb = wrapper.querySelector('vaadin-breadcrumb')!;
      await nextRender();
      await aTimeout(0);
    });

    it('should have aria-haspopup="true" on the overflow button', () => {
      const overflowButton = breadcrumb.querySelector('[data-overflow]');
      expect(overflowButton).to.be.ok;
      expect(overflowButton!.getAttribute('aria-haspopup')).to.equal('true');
    });

    it('should have aria-label from i18n.moreItems on the overflow button', () => {
      const overflowButton = breadcrumb.querySelector('[data-overflow]');
      expect(overflowButton).to.be.ok;
      expect(overflowButton!.getAttribute('aria-label')).to.equal('Show collapsed items');
    });

    it('should have aria-expanded="false" initially on the overflow button', () => {
      const overflowButton = breadcrumb.querySelector('[data-overflow]');
      expect(overflowButton).to.be.ok;
      expect(overflowButton!.getAttribute('aria-expanded')).to.equal('false');
    });
  });

  describe('separator accessibility', () => {
    let breadcrumb: Breadcrumb;
    let items: NodeListOf<BreadcrumbItem>;

    beforeEach(async () => {
      breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `);
      await nextRender();
      items = breadcrumb.querySelectorAll('vaadin-breadcrumb-item');
    });

    it('should have aria-hidden="true" on separator elements', () => {
      for (const item of items) {
        const separator = item.shadowRoot!.querySelector('[part="separator"]')!;
        expect(separator.getAttribute('aria-hidden')).to.equal('true');
      }
    });
  });
});
