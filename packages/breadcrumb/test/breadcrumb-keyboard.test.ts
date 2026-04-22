import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextResize, nextUpdate, oneEvent } from '@vaadin/testing-helpers';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
// Enable the feature flag before importing so the elements register in the
// global custom elements registry.
window.Vaadin.featureFlags!.breadcrumbComponent = true;

await import('../vaadin-breadcrumb.js');

import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import type { Breadcrumb } from '../vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../vaadin-breadcrumb-item.js';

describe('vaadin-breadcrumb keyboard', () => {
  // Reuse the deterministic-width fixture pattern from the overflow detection
  // block in breadcrumb.test.ts so `has-overflow` and which items are hidden
  // remain reliable across browsers and themes.
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
    // Allow the initial ResizeObserver callback to fire so overflow
    // detection runs against the actual rendered widths.
    await nextFrame();
    await nextFrame();
    return { wrapper, breadcrumb };
  }

  async function setWrapperWidth(wrapper: HTMLElement, breadcrumb: Breadcrumb, width: number): Promise<void> {
    wrapper.style.width = `${width}px`;
    await nextResize(breadcrumb);
    // ResizeMixin schedules `_onResize` from a setTimeout inside the
    // ResizeObserver callback; wait one more frame so __updateOverflow has
    // run and the attributes are applied.
    await nextFrame();
  }

  function getItems(breadcrumb: Breadcrumb): BreadcrumbItem[] {
    return Array.from(breadcrumb.querySelectorAll('vaadin-breadcrumb-item')) as BreadcrumbItem[];
  }

  function getById(breadcrumb: Breadcrumb, id: string): BreadcrumbItem {
    return breadcrumb.querySelector(`[data-test-id="${id}"]`) as BreadcrumbItem;
  }

  function getOverflowButton(breadcrumb: Breadcrumb): HTMLButtonElement {
    return breadcrumb.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLButtonElement;
  }

  function getOverlay(breadcrumb: Breadcrumb): HTMLElement & { opened: boolean } {
    return breadcrumb.shadowRoot!.querySelector('vaadin-breadcrumb-overlay') as HTMLElement & { opened: boolean };
  }

  function getInnerLink(item: BreadcrumbItem): HTMLElement {
    return item.shadowRoot!.querySelector('[part="link"]') as HTMLElement;
  }

  // Move focus to the document body so the next Tab key press deterministically
  // moves focus to the first focusable element in the document.
  function focusBody(): void {
    const active = document.activeElement as HTMLElement | null;
    if (active && active !== document.body) {
      active.blur();
    }
    // `body.focus()` is a no-op without `tabindex`; `blur()` above already
    // returns activeElement to the body, but call it for completeness.
    document.body.focus();
  }

  describe('Tab navigation order', () => {
    it('should move focus through root link, overflow button, and remaining visible item links in DOM order', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      // Force overflow so the overflow button and several `data-overflow-hidden`
      // items are present.
      await setWrapperWidth(wrapper, breadcrumb, 400);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      // Capture which items are currently visible (not hidden) so we can pin
      // the expected Tab cycle by `data-test-id`, not by DOM position.
      const visibleIds = getItems(breadcrumb)
        .filter((item) => !item.hasAttribute('data-overflow-hidden'))
        .map((item) => item.dataset.testId!);
      // Sanity-check the fixture: the root and current items must be visible
      // (the current item never collapses), and at least one middle item
      // must be hidden so the overflow button participates in the cycle.
      expect(visibleIds[0]).to.equal('root');
      expect(visibleIds[visibleIds.length - 1]).to.equal('current');
      expect(visibleIds.length).to.be.lessThan(getItems(breadcrumb).length);

      const root = getById(breadcrumb, 'root');
      const overflowButton = getOverflowButton(breadcrumb);

      focusBody();
      expect(document.activeElement).to.equal(document.body);

      // Tab #1 should land on the root item's inner <a>.
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(getInnerLink(root));

      // Tab #2 should land on the overflow button (in the breadcrumb's shadow
      // DOM, between the root slot and the default slot).
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(overflowButton);

      // Tab through the remaining visible items, in DOM order. The current
      // item (last) renders as a <span>, which is not focusable by default,
      // so the cycle ends one item earlier than `visibleIds.length` would
      // suggest.
      const remainingIds = visibleIds.slice(1, -1);
      for (const id of remainingIds) {
        await sendKeys({ press: 'Tab' });
        expect(getDeepActiveElement(), `expected focus on item "${id}"`).to.equal(
          getInnerLink(getById(breadcrumb, id)),
        );
      }
    });

    it('should skip items hidden via data-overflow-hidden in the Tab cycle', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      await setWrapperWidth(wrapper, breadcrumb, 400);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      const hiddenItems = getItems(breadcrumb).filter((item) => item.hasAttribute('data-overflow-hidden'));
      // The fixture must actually hide some items for this assertion to be
      // meaningful.
      expect(hiddenItems.length).to.be.greaterThan(0);
      const hiddenInnerLinks = hiddenItems.map((item) => getInnerLink(item));

      const root = getById(breadcrumb, 'root');
      const overflowButton = getOverflowButton(breadcrumb);

      focusBody();
      expect(document.activeElement).to.equal(document.body);

      // Walk the entire Tab cycle through the breadcrumb. The cycle ends
      // when focus leaves the breadcrumb (i.e. activeElement is no longer
      // the breadcrumb host or the overflow button).
      const visited: Element[] = [];
      // Tab into the breadcrumb (root link).
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(getInnerLink(root));
      visited.push(getDeepActiveElement());

      // Tab through every remaining focusable element inside the breadcrumb.
      // We bound the loop by the total number of items + the overflow button
      // to avoid an infinite loop in case of a regression.
      const maxTabs = getItems(breadcrumb).length + 2;
      for (let i = 0; i < maxTabs; i += 1) {
        await sendKeys({ press: 'Tab' });
        const active = getDeepActiveElement();
        // Once focus leaves the breadcrumb subtree, stop.
        if (!breadcrumb.contains(active) && active !== overflowButton) {
          break;
        }
        visited.push(active);
      }

      // None of the inner links of hidden items must have been visited.
      hiddenInnerLinks.forEach((link, index) => {
        const id = hiddenItems[index].dataset.testId!;
        expect(visited, `expected hidden item "${id}" to be skipped`).to.not.include(link);
      });
    });
  });

  describe('overflow button activation', () => {
    it('should open the overlay when Enter is pressed on a focused overflow button', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      await setWrapperWidth(wrapper, breadcrumb, 400);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      const overflowButton = getOverflowButton(breadcrumb);
      const overlay = getOverlay(breadcrumb);

      overflowButton.focus();
      expect(getDeepActiveElement()).to.equal(overflowButton);
      expect(Boolean(overlay.opened)).to.be.false;

      // Native <button> activates on Enter — this exercises the browser's
      // built-in click synthesis path.
      const overlayOpen = oneEvent(overlay, 'vaadin-overlay-open');
      await sendKeys({ press: 'Enter' });
      await overlayOpen;
      await nextUpdate(breadcrumb);

      expect(overlay.opened).to.be.true;
      expect(overflowButton.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should open the overlay when Space is pressed on a focused overflow button', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      await setWrapperWidth(wrapper, breadcrumb, 400);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      const overflowButton = getOverflowButton(breadcrumb);
      const overlay = getOverlay(breadcrumb);

      overflowButton.focus();
      expect(getDeepActiveElement()).to.equal(overflowButton);
      expect(Boolean(overlay.opened)).to.be.false;

      // Native <button> activates on Space release. `sendKeys({ press })`
      // dispatches a full keydown/keyup pair, which is what the browser uses
      // to synthesize the click.
      const overlayOpen = oneEvent(overlay, 'vaadin-overlay-open');
      await sendKeys({ press: 'Space' });
      await overlayOpen;
      await nextUpdate(breadcrumb);

      expect(overlay.opened).to.be.true;
      expect(overflowButton.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('Escape closes the overlay', () => {
    it('should close the overlay and return focus to the overflow button when Escape is pressed', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      await setWrapperWidth(wrapper, breadcrumb, 400);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      const overflowButton = getOverflowButton(breadcrumb);
      const overlay = getOverlay(breadcrumb);

      // Focus the overflow button first so we can assert that focus returns
      // to it after Escape closes the overlay.
      overflowButton.focus();
      expect(getDeepActiveElement()).to.equal(overflowButton);

      // Open the overlay via the keyboard activation path so the open is
      // attributable to a focused button — the same path a keyboard user
      // would take.
      const overlayOpen = oneEvent(overlay, 'vaadin-overlay-open');
      await sendKeys({ press: 'Enter' });
      await overlayOpen;
      await nextUpdate(breadcrumb);
      expect(overlay.opened).to.be.true;

      await sendKeys({ press: 'Escape' });
      await nextUpdate(breadcrumb);

      expect(overlay.opened).to.be.false;
      expect(overflowButton.getAttribute('aria-expanded')).to.equal('false');
      // After Escape, focus must be back on the overflow button so the
      // keyboard user can continue navigating from where they were.
      expect(getDeepActiveElement()).to.equal(overflowButton);
    });
  });

  describe('current item span is not focusable', () => {
    it('should not focus the current item inner <span> when tabbing through a trail with overflow', async () => {
      const { wrapper, breadcrumb } = await buildFixture(2000);
      await setWrapperWidth(wrapper, breadcrumb, 400);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      const current = getById(breadcrumb, 'current');
      // The fixture's current item has no `path`, so it must render as a
      // <span> via the breadcrumb-item template. A <span> is not focusable
      // by default and must therefore not appear in the Tab cycle.
      const currentInner = getInnerLink(current);
      expect(currentInner.tagName).to.equal('SPAN');
      expect(current.hasAttribute('current')).to.be.true;

      focusBody();

      // Walk the entire Tab cycle and assert the current item's inner <span>
      // is never the active element. Bound the loop by the total number of
      // items + the overflow button so a regression cannot loop forever.
      const maxTabs = getItems(breadcrumb).length + 2;
      const visited: Element[] = [];
      for (let i = 0; i < maxTabs; i += 1) {
        await sendKeys({ press: 'Tab' });
        const active = getDeepActiveElement();
        // Once focus leaves the breadcrumb subtree, stop.
        if (!breadcrumb.contains(active) && active !== getOverflowButton(breadcrumb)) {
          break;
        }
        visited.push(active);
      }

      expect(visited).to.not.include(currentInner);
    });
  });
});
