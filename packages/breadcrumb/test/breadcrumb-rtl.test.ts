import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextResize } from '@vaadin/testing-helpers';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
// Enable the feature flag before importing so the elements register in the
// global custom elements registry.
window.Vaadin.featureFlags!.breadcrumbComponent = true;

await import('../vaadin-breadcrumb.js');

import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { breadcrumbStyles } from '../src/styles/vaadin-breadcrumb-base-styles.js';
import { breadcrumbItemStyles } from '../src/styles/vaadin-breadcrumb-item-base-styles.js';
import { breadcrumbOverlayStyles } from '../src/styles/vaadin-breadcrumb-overlay-base-styles.js';
import type { Breadcrumb } from '../vaadin-breadcrumb.js';
import type { BreadcrumbItem } from '../vaadin-breadcrumb-item.js';

describe('vaadin-breadcrumb RTL', () => {
  // Reuse the deterministic-width fixture pattern from the overflow detection
  // block in breadcrumb.test.ts so `has-overflow` and which items are hidden
  // remain reliable across browsers and themes — including in RTL.
  const ITEM_WIDTH = 100;

  function fixedWidthItem(id: string, label: string, path?: string): string {
    const pathAttr = path ? ` path="${path}"` : '';
    return `<vaadin-breadcrumb-item data-test-id="${id}"${pathAttr} style="width: ${ITEM_WIDTH}px; box-sizing: border-box; flex: none;">${label}</vaadin-breadcrumb-item>`;
  }

  async function buildRtlFixture(width: number): Promise<{ wrapper: HTMLElement; breadcrumb: Breadcrumb }> {
    // Wrap the breadcrumb in a `dir="rtl"` ancestor so `:host-context([dir='rtl'])`
    // in the base styles applies to the items and the overflow separator.
    const wrapper = fixtureSync(`
      <div dir="rtl" style="width: ${width}px;">
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

  function getOverflow(breadcrumb: Breadcrumb): HTMLElement {
    return breadcrumb.shadowRoot!.querySelector('[part="overflow"]') as HTMLElement;
  }

  function getOverflowButton(breadcrumb: Breadcrumb): HTMLButtonElement {
    return breadcrumb.shadowRoot!.querySelector('[part="overflow-button"]') as HTMLButtonElement;
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
    document.body.focus();
  }

  // Parse the resolved `transform: matrix(a, b, c, d, tx, ty)` string and
  // return the `a` (x-scale) component. Returns NaN if the transform isn't
  // a 2D matrix — the assertion sites must therefore check the parsed value
  // explicitly so a "none" or unexpected representation doesn't pass silently.
  function getMatrixXScale(transform: string): number {
    const match = transform.match(/^matrix\(\s*(-?\d+(?:\.\d+)?)/);
    if (!match) {
      return NaN;
    }
    return parseFloat(match[1]);
  }

  describe('separator transform', () => {
    it('should flip every visible non-last item separator with scaleX(-1)', async () => {
      const { wrapper, breadcrumb } = await buildRtlFixture(2000);
      // Force overflow so we exercise both visible-item separators and the
      // overflow separator inside the same RTL trail.
      await setWrapperWidth(wrapper, breadcrumb, 400);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      // Per the item base styles, `:host(:last-of-type)::after` and
      // `:host([current])::after` are display:none, so only non-last,
      // non-current items render the separator — but `:host-context([dir='rtl'])`
      // applies the transform to all items regardless. We assert against the
      // visible non-last items because the test is about what the user sees.
      const visibleNonLastItems = getItems(breadcrumb).filter(
        (item) => !item.hasAttribute('data-overflow-hidden') && !item.hasAttribute('current'),
      );
      // Sanity-check the fixture: there must be at least one visible non-last
      // item, otherwise the loop below would pass vacuously.
      expect(visibleNonLastItems.length).to.be.greaterThan(0);

      visibleNonLastItems.forEach((item) => {
        const transform = getComputedStyle(item, '::after').transform;
        const xScale = getMatrixXScale(transform);
        expect(xScale, `item ${item.dataset.testId!} ::after transform was ${transform}`).to.equal(-1);
      });
    });

    it('should flip the overflow separator with scaleX(-1)', async () => {
      const { wrapper, breadcrumb } = await buildRtlFixture(2000);
      await setWrapperWidth(wrapper, breadcrumb, 400);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      const overflow = getOverflow(breadcrumb);
      const transform = getComputedStyle(overflow, '::after').transform;
      const xScale = getMatrixXScale(transform);
      expect(xScale, `overflow ::after transform was ${transform}`).to.equal(-1);
    });
  });

  describe('visual layout in RTL', () => {
    it('should place the root item to the right of the current item', async () => {
      // No overflow — the entire trail fits, and we just want to assert that
      // RTL flips the visual order: root sits on the right, current on the left.
      const { breadcrumb } = await buildRtlFixture(2000);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.false;

      const root = getById(breadcrumb, 'root');
      const current = getById(breadcrumb, 'current');

      const rootRect = root.getBoundingClientRect();
      const currentRect = current.getBoundingClientRect();
      expect(
        rootRect.left,
        `expected root.left (${rootRect.left}) to be greater than current.left (${currentRect.left}) in RTL`,
      ).to.be.greaterThan(currentRect.left);
    });

    it('should place the overflow button between the root and the next visible item', async () => {
      const { wrapper, breadcrumb } = await buildRtlFixture(2000);
      // Force overflow so the overflow button is visible between the root
      // slot and the next visible item in the default slot.
      await setWrapperWidth(wrapper, breadcrumb, 400);
      expect(breadcrumb.hasAttribute('has-overflow')).to.be.true;

      const root = getById(breadcrumb, 'root');
      const overflowButton = getOverflowButton(breadcrumb);

      // The "next visible item" is the first item after root that is not
      // hidden by overflow detection.
      const nextVisible = getItems(breadcrumb).find(
        (item) => item !== root && !item.hasAttribute('data-overflow-hidden'),
      );
      expect(nextVisible, 'expected at least one visible item after the root').to.exist;

      const rootRect = root.getBoundingClientRect();
      const overflowRect = overflowButton.getBoundingClientRect();
      const nextRect = (nextVisible as BreadcrumbItem).getBoundingClientRect();

      // In RTL, the visual order from right to left is:
      // root → overflow → next visible item → ... → current.
      // That means root.left > overflow.left > nextVisible.left.
      expect(
        rootRect.left,
        `expected root.left (${rootRect.left}) > overflow.left (${overflowRect.left})`,
      ).to.be.greaterThan(overflowRect.left);
      expect(
        overflowRect.left,
        `expected overflow.left (${overflowRect.left}) > nextVisible.left (${nextRect.left})`,
      ).to.be.greaterThan(nextRect.left);
    });
  });

  describe('Tab order in RTL', () => {
    it('should move focus through root link, overflow button, and remaining visible item links in DOM order', async () => {
      const { wrapper, breadcrumb } = await buildRtlFixture(2000);
      // Force overflow so the overflow button and several `data-overflow-hidden`
      // items are present — same fixture shape as the LTR keyboard test.
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

      // Tab #1 should land on the root item's inner <a>. RTL must not change
      // focus order — focus follows DOM order, which in turn matches the
      // visual order because the visual flip is purely a `direction: rtl`
      // effect.
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(getInnerLink(root));

      // Tab #2 should land on the overflow button.
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
  });

  describe('base styles use logical properties only', () => {
    // Logical properties (margin-inline-start/-end, padding-inline-start/-end,
    // inset-inline-start/-end) flip automatically in RTL contexts. The
    // physical equivalents (margin-left, padding-right, etc.) do not, and
    // would silently leave RTL layouts broken. To keep the base styles RTL-safe
    // by construction, we assert that none of the disallowed substrings appear
    // in the imported CSS sources.
    //
    // This is the only kind of test that's allowed to inspect source text:
    // the assertion is structural, not behavioural, and importing the `css`
    // template lets us inspect `cssText` without reading from disk.
    const FORBIDDEN_PROPERTIES = [
      'margin-left',
      'margin-right',
      'padding-left',
      'padding-right',
      // `left:` / `right:` as standalone property names — `border-left` and
      // friends are caught by their own substrings if anyone introduces them.
      // We append a colon to avoid matching identifiers like `flex-start` or
      // accidental substrings of words.
      'left:',
      'right:',
    ];

    function assertNoPhysicalProperties(label: string, cssText: string): void {
      FORBIDDEN_PROPERTIES.forEach((prop) => {
        expect(cssText.indexOf(prop), `${label} contains forbidden physical property "${prop}"`).to.equal(-1);
      });
    }

    it('should not use physical properties in vaadin-breadcrumb-base-styles.js', () => {
      assertNoPhysicalProperties('breadcrumbStyles', breadcrumbStyles.cssText);
    });

    it('should not use physical properties in vaadin-breadcrumb-item-base-styles.js', () => {
      assertNoPhysicalProperties('breadcrumbItemStyles', breadcrumbItemStyles.cssText);
    });

    it('should not use physical properties in vaadin-breadcrumb-overlay-base-styles.js', () => {
      assertNoPhysicalProperties('breadcrumbOverlayStyles', breadcrumbOverlayStyles.cssText);
    });
  });
});
