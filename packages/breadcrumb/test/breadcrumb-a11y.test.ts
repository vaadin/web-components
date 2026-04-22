import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextResize, nextUpdate, oneEvent } from '@vaadin/testing-helpers';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
// Enable the feature flag before importing so the elements register in the
// global custom elements registry.
window.Vaadin.featureFlags!.breadcrumbComponent = true;

await import('../vaadin-breadcrumb.js');

import type { Breadcrumb } from '../vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../vaadin-breadcrumb-item.js';

describe('vaadin-breadcrumb accessibility', () => {
  describe('host role and aria-label', () => {
    it('should set role="navigation" on the host', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();
      expect(breadcrumb.getAttribute('role')).to.equal('navigation');
    });

    it('should preserve an application-supplied aria-label on the host', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb aria-label="Trail"></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();
      // Component must not set or overwrite the application-provided aria-label.
      expect(breadcrumb.getAttribute('aria-label')).to.equal('Trail');
    });

    it('should not set aria-label on the host by default', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();
      // No default label is provided per spec — applications must supply one.
      expect(breadcrumb.hasAttribute('aria-label')).to.be.false;
    });
  });

  describe('list semantics', () => {
    it('should set role="list" on the shadow [part="list"] element', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();
      const list = breadcrumb.shadowRoot!.querySelector('[part="list"]') as HTMLElement;
      expect(list).to.exist;
      expect(list.getAttribute('role')).to.equal('list');
    });

    it('should set role="listitem" on each slotted vaadin-breadcrumb-item', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const items = Array.from(breadcrumb.querySelectorAll('vaadin-breadcrumb-item')) as BreadcrumbItem[];
      expect(items).to.have.lengthOf(3);
      items.forEach((item) => {
        expect(item.getAttribute('role')).to.equal('listitem');
      });
    });
  });

  describe('aria-current on the current item', () => {
    it('should set aria-current="page" only on the inner link/span of the current item', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const items = Array.from(breadcrumb.querySelectorAll('vaadin-breadcrumb-item')) as BreadcrumbItem[];
      const current = items.find((item) => item.dataset.testId === 'c')!;

      // The Task 3 MutationObserver on the item reacts to the `current`
      // attribute set by the container. Wait for that update cycle to render
      // the inner link/span with `aria-current`.
      await nextUpdate(current);

      const currentLink = current.shadowRoot!.querySelector('[part="link"]')!;
      expect(currentLink.getAttribute('aria-current')).to.equal('page');

      // Every other item's inner link/span must lack aria-current entirely.
      items
        .filter((item) => item !== current)
        .forEach((item) => {
          const link = item.shadowRoot!.querySelector('[part="link"]')!;
          expect(link.hasAttribute('aria-current'), `item ${item.dataset.testId} should not have aria-current`).to.be
            .false;
        });
    });
  });

  describe('overflow button ARIA', () => {
    // Reuse the deterministic-width fixture pattern from the overflow detection
    // block in breadcrumb.test.ts so `has-overflow` toggles reliably.
    const ITEM_WIDTH = 100;

    function fixedWidthItem(id: string, label: string, path?: string): string {
      const pathAttr = path ? ` path="${path}"` : '';
      return `<vaadin-breadcrumb-item data-test-id="${id}"${pathAttr} style="width: ${ITEM_WIDTH}px; box-sizing: border-box; flex: none;">${label}</vaadin-breadcrumb-item>`;
    }

    async function buildFixture(width: number): Promise<{ wrapper: HTMLElement; breadcrumb: Breadcrumb }> {
      const wrapper = fixtureSync(`
        <div style="width: ${width}px;">
          <vaadin-breadcrumb>
            ${fixedWidthItem('root', 'Root', '/')}
            ${fixedWidthItem('a', 'A', '/a')}
            ${fixedWidthItem('b', 'B', '/b')}
            ${fixedWidthItem('c', 'C', '/c')}
            ${fixedWidthItem('d', 'D', '/d')}
            ${fixedWidthItem('e', 'E', '/e')}
            ${fixedWidthItem('current', 'Current')}
          </vaadin-breadcrumb>
        </div>
      `) as HTMLElement;
      const breadcrumb = wrapper.querySelector('vaadin-breadcrumb') as Breadcrumb;
      await nextRender();
      // Allow the initial ResizeObserver callback to fire so overflow detection
      // runs against the actual rendered widths.
      await nextFrame();
      await nextFrame();
      return { wrapper, breadcrumb };
    }

    async function setWrapperWidth(wrapper: HTMLElement, breadcrumb: Breadcrumb, width: number): Promise<void> {
      wrapper.style.width = `${width}px`;
      await nextResize(breadcrumb);
      await nextFrame();
    }

    function getOverflowButton(breadcrumb: Breadcrumb): HTMLButtonElement {
      return breadcrumb.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLButtonElement;
    }

    function getOverlay(breadcrumb: Breadcrumb): HTMLElement & { opened: boolean } {
      return breadcrumb.shadowRoot!.querySelector('vaadin-breadcrumb-overlay') as HTMLElement & { opened: boolean };
    }

    it('should set aria-haspopup="true" and an aria-label driven by i18n.moreItems on the overflow button', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();

      const button = getOverflowButton(breadcrumb);
      expect(button.getAttribute('aria-haspopup')).to.equal('true');
      // Default i18n.moreItems is the empty string per the established API.
      expect(button.getAttribute('aria-label')).to.equal('');

      breadcrumb.i18n = { moreItems: 'Show more breadcrumbs' };
      await nextUpdate(breadcrumb);
      expect(button.getAttribute('aria-label')).to.equal('Show more breadcrumbs');
      // aria-haspopup must remain stable when i18n changes.
      expect(button.getAttribute('aria-haspopup')).to.equal('true');
    });

    it('should toggle aria-expanded on the overflow button as the overlay opens and closes', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      await setWrapperWidth(wrapper, breadcrumb, 400);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      const button = getOverflowButton(breadcrumb);
      const overlay = getOverlay(breadcrumb);

      // Initial state: overlay closed, aria-expanded reflects "false".
      expect(button.getAttribute('aria-expanded')).to.equal('false');

      // Open: clicking the overflow button opens the overlay and toggles
      // aria-expanded to "true".
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      await nextUpdate(breadcrumb);
      expect(overlay.opened).to.be.true;
      expect(button.getAttribute('aria-expanded')).to.equal('true');

      // Close: clicking the button again closes the overlay and restores
      // aria-expanded to "false".
      button.click();
      await nextUpdate(breadcrumb);
      expect(overlay.opened).to.be.false;
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });
  });

  describe('separator pseudo-elements', () => {
    // The separator is rendered via a CSS background (the `::after` mask-image)
    // and its `content` is the empty string. Assistive tech must not announce
    // any text from it. We assert the resolved `content` value is the empty
    // string (`""`) — which is what browsers normalise `content: ''` to. We
    // accept the literal `'none'` representation as a fallback for browsers
    // that report no announceable content.

    function expectEmptyContent(value: string, location: string): void {
      // CSSOM normalises `content: ''` to the literal string `""` (a quoted
      // empty string). `'none'` would mean the pseudo has no content at all,
      // which would also satisfy the "nothing announced" requirement.
      const isEmptyQuotedString = value === '""' || value === "''";
      const isNone = value === 'none';
      expect(
        isEmptyQuotedString || isNone,
        `${location} ::after content was ${JSON.stringify(value)}, expected '""' or 'none'`,
      ).to.be.true;
    }

    it('should render an empty ::after content on a non-last vaadin-breadcrumb-item', async () => {
      const breadcrumb = fixtureSync(`
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item data-test-id="a" path="/a">A</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="b" path="/b">B</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item data-test-id="c">C</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>
      `) as Breadcrumb;
      await nextRender();

      const firstItem = breadcrumb.querySelector('[data-test-id="a"]') as BreadcrumbItem;
      const content = getComputedStyle(firstItem, '::after').content;
      expectEmptyContent(content, 'first item');
    });

    it('should render an empty ::after content on the overflow [part="overflow"] separator', async () => {
      const breadcrumb = fixtureSync('<vaadin-breadcrumb></vaadin-breadcrumb>') as Breadcrumb;
      await nextRender();

      const overflow = breadcrumb.shadowRoot!.querySelector('[part="overflow"]') as HTMLElement;
      const content = getComputedStyle(overflow, '::after').content;
      expectEmptyContent(content, 'overflow');
    });
  });
});
