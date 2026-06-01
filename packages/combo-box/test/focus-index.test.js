import { expect } from '@vaadin/chai-plugins';
import { arrowUpKeyDown, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { ComboBoxPlaceholder } from '../src/vaadin-combo-box-placeholder.js';
import { flushComboBox, getViewportItems, makeItems } from './helpers.js';

describe('__focusIndex', () => {
  let comboBox;

  describe('items array', () => {
    const SIZE = 200;

    beforeEach(async () => {
      comboBox = fixtureSync(`
        <vaadin-combo-box
          style="--vaadin-combo-box-overlay-max-height: 400px"
        ></vaadin-combo-box>
      `);
      await nextRender();
      comboBox.items = makeItems(SIZE);
    });

    it('should scroll to the item at the given index when opened', () => {
      comboBox.opened = true;
      comboBox.__focusIndex(100);
      flushComboBox(comboBox);
      const viewport = getViewportItems(comboBox);
      expect(viewport.map((item) => item.index)).to.include(100);
    });

    it('should set the focused index to the given index', () => {
      comboBox.opened = true;
      comboBox.__focusIndex(100);
      expect(comboBox._focusedIndex).to.equal(100);
    });

    it('should place the target in the middle of the viewport when opened', async () => {
      comboBox.opened = true;
      comboBox.__focusIndex(100);
      flushComboBox(comboBox);
      await nextFrame();

      const findItem = (index) => [...comboBox._scroller.children].find((el) => !el.hidden && el.index === index);
      const scrollerRect = comboBox._scroller.getBoundingClientRect();
      const targetRect = findItem(100).getBoundingClientRect();
      // The target is fully visible and centered in the viewport.
      expect(targetRect.top).to.be.at.least(scrollerRect.top - 1);
      expect(targetRect.bottom).to.be.at.most(scrollerRect.bottom + 1);
      const targetCenter = targetRect.top + targetRect.height / 2;
      const scrollerCenter = scrollerRect.top + scrollerRect.height / 2;
      expect(targetCenter).to.be.closeTo(scrollerCenter, targetRect.height / 2 + 1);
    });

    it('should queue the scroll when called before opening', async () => {
      comboBox.__focusIndex(100);
      expect(comboBox.__pendingFocusIndex).to.equal(100);

      comboBox.opened = true;
      await nextFrame();
      flushComboBox(comboBox);

      const viewport = getViewportItems(comboBox);
      expect(viewport.map((item) => item.index)).to.include(100);
    });

    it('should update aria-activedescendant after scrolling', async () => {
      comboBox.opened = true;
      comboBox.__focusIndex(100);
      flushComboBox(comboBox);
      await nextFrame();
      const activeId = comboBox.inputElement.getAttribute('aria-activedescendant');
      expect(activeId).to.be.ok;
      const item = comboBox._scroller.querySelector(`#${activeId}`);
      expect(item.index).to.equal(100);
    });

    it('should clear pending scroll when filter changes', () => {
      comboBox.__focusIndex(100);
      comboBox.filter = 'item 1';
      comboBox.opened = true;
      flushComboBox(comboBox);
      const viewport = getViewportItems(comboBox);
      expect(viewport[0].index).to.equal(0);
    });

    [-1, Number.NaN, '100', SIZE + 50].forEach((invalidIndex) => {
      it(`should ignore invalid index: ${String(invalidIndex)}`, () => {
        comboBox.opened = true;
        comboBox.__focusIndex(invalidIndex);
        flushComboBox(comboBox);
        expect(getViewportItems(comboBox)[0].index).to.equal(0);
      });
    });

    it('should override a previous scroll call', () => {
      comboBox.opened = true;
      comboBox.__focusIndex(50);
      comboBox.__focusIndex(150);
      flushComboBox(comboBox);
      const viewport = getViewportItems(comboBox);
      expect(viewport.map((item) => item.index)).to.include(150);
    });

    it('should scroll to 0', () => {
      comboBox.opened = true;
      comboBox._scrollIntoView(SIZE - 1);
      flushComboBox(comboBox);
      comboBox.__focusIndex(0);
      flushComboBox(comboBox);
      expect(getViewportItems(comboBox)[0].index).to.equal(0);
    });

    it('should not auto-scroll on open when __focusIndex was never called', () => {
      comboBox.selectedItem = comboBox.items[100];

      comboBox.opened = true;
      flushComboBox(comboBox);

      // PR #6055: opening with a mid-list selectedItem must not auto-scroll.
      const viewport = getViewportItems(comboBox);
      expect(viewport[0].index).to.equal(0);
    });
  });

  describe('variable-height items', () => {
    const SIZE = 200;
    // Long wrapping label every 5th item makes those rows taller than
    // the rest, so the index-based positioning in `scrollIntoView` can
    // place the target outside the viewport.
    const LONG_LABEL = 'Long label that wraps to two or three lines making the row taller than its neighbors';
    const items = Array.from({ length: SIZE }, (_, i) => (i % 5 === 0 ? `${LONG_LABEL} ${i}` : `item ${i}`));

    function getScrollerRect() {
      return comboBox._scroller.getBoundingClientRect();
    }

    function findRenderedItem(index) {
      return [...comboBox._scroller.children].find((el) => !el.hidden && el.index === index);
    }

    // Asserts the target is fully visible and centered in the viewport.
    function expectCenteredInViewport(index) {
      const scrollerRect = getScrollerRect();
      const targetRect = findRenderedItem(index).getBoundingClientRect();
      expect(targetRect.top).to.be.at.least(scrollerRect.top - 1);
      expect(targetRect.bottom).to.be.at.most(scrollerRect.bottom + 1);
      const targetCenter = targetRect.top + targetRect.height / 2;
      const scrollerCenter = scrollerRect.top + scrollerRect.height / 2;
      expect(targetCenter).to.be.closeTo(scrollerCenter, 2.5);
    }

    beforeEach(async () => {
      comboBox = fixtureSync(`
        <vaadin-combo-box
          style="--vaadin-combo-box-overlay-max-height: 400px"
        ></vaadin-combo-box>
      `);
      await nextRender();
      comboBox.items = items;
    });

    it('should center a target below the viewport with variable heights', async () => {
      comboBox.opened = true;
      flushComboBox(comboBox);

      const targetIndex = 30;
      comboBox.__focusIndex(targetIndex);
      flushComboBox(comboBox);
      await nextFrame();

      expectCenteredInViewport(targetIndex);
    });

    it('should center a target above the viewport with variable heights', async () => {
      comboBox.opened = true;
      flushComboBox(comboBox);

      // Pre-scroll well past the target, then jump back to a centerable index.
      comboBox.__focusIndex(150);
      flushComboBox(comboBox);
      await nextFrame();

      const targetIndex = 30;
      comboBox.__focusIndex(targetIndex);
      flushComboBox(comboBox);
      await nextFrame();

      expectCenteredInViewport(targetIndex);
    });

    it('should re-center an already-visible target with variable heights', async () => {
      comboBox.opened = true;
      flushComboBox(comboBox);
      await nextFrame();

      const firstVisible = comboBox._scroller.__virtualizer.firstVisibleIndex;
      const lastVisible = comboBox._scroller.__virtualizer.lastVisibleIndex;
      const targetIndex = firstVisible + Math.floor((lastVisible - firstVisible) / 2);

      comboBox.__focusIndex(targetIndex);
      flushComboBox(comboBox);
      await nextFrame();

      expectCenteredInViewport(targetIndex);
    });

    it('should clamp to the top for a near-start target that cannot be centered', async () => {
      comboBox.opened = true;
      flushComboBox(comboBox);
      await nextFrame();

      const targetIndex = 2;
      comboBox.__focusIndex(targetIndex);
      flushComboBox(comboBox);
      await nextFrame();

      // Not enough rows above to center; the list stays scrolled to the top
      // and the target is fully visible.
      expect(comboBox._scroller.scrollTop).to.be.closeTo(0, 1);
      const scrollerRect = getScrollerRect();
      const targetRect = findRenderedItem(targetIndex).getBoundingClientRect();
      expect(targetRect.top).to.be.at.least(scrollerRect.top - 1);
      expect(targetRect.bottom).to.be.at.most(scrollerRect.bottom + 1);
    });
  });

  describe('data provider', () => {
    const SIZE = 500;
    const PAGE_SIZE = 50;
    let pendingCallbacks;

    function flushPendingCallbacks() {
      const callbacks = pendingCallbacks;
      pendingCallbacks = [];
      callbacks.forEach((cb) => cb());
    }

    const asyncDataProvider = (params, callback) => {
      pendingCallbacks.push(() => {
        const items = makeItems(SIZE).slice(params.page * params.pageSize, (params.page + 1) * params.pageSize);
        callback(items, SIZE);
      });
    };

    beforeEach(async () => {
      pendingCallbacks = [];
      comboBox = fixtureSync(`
        <vaadin-combo-box
          style="--vaadin-combo-box-overlay-max-height: 400px"
        ></vaadin-combo-box>
      `);
      await nextRender();
      comboBox.pageSize = PAGE_SIZE;
      comboBox.dataProvider = asyncDataProvider;
    });

    it('should queue the scroll while the first page is loading', async () => {
      comboBox.opened = true;
      // Target is in the first page (pageSize=50) so the scroll can settle
      // as soon as that page lands.
      comboBox.__focusIndex(30);
      expect(comboBox.__pendingFocusIndex).to.equal(30);

      flushPendingCallbacks();
      await nextFrame();
      flushComboBox(comboBox);

      const viewport = getViewportItems(comboBox);
      expect(viewport.some((item) => item.index === 30 && !(item.item instanceof ComboBoxPlaceholder))).to.be.true;
    });

    it('should scroll to an unloaded index after its page loads', async () => {
      comboBox.opened = true;
      flushPendingCallbacks();
      await nextFrame();

      comboBox.__focusIndex(300);
      flushComboBox(comboBox);
      await nextFrame();
      // Drain the page request so the items around index 300 become real.
      flushPendingCallbacks();
      await nextFrame();
      flushComboBox(comboBox);

      const viewport = getViewportItems(comboBox);
      expect(viewport.some((item) => item.index === 300 && !(item.item instanceof ComboBoxPlaceholder))).to.be.true;
    });

    it('should clear pending scroll when filter changes', () => {
      comboBox.__focusIndex(300);
      expect(comboBox.__pendingFocusIndex).to.equal(300);

      comboBox.filter = 'item 1';
      expect(comboBox.__pendingFocusIndex).to.be.undefined;
    });

    it('should scroll to an unloaded index on reopen with cached first page', async () => {
      // First open caches page 0, then close.
      comboBox.opened = true;
      flushPendingCallbacks();
      await nextFrame();
      comboBox.opened = false;
      await nextFrame();

      // Queue a scroll to a far index whose page is NOT cached. Reopening
      // hits the page-0 cache so `loading` never flips to true — the only
      // signal that index 300 was requested has to come from `__focusIndex`
      // itself, via its placeholder branch.
      comboBox.__focusIndex(300);
      expect(comboBox.__pendingFocusIndex).to.equal(300);

      comboBox.opened = true;
      await nextFrame();

      // The placeholder branch must enqueue the page-6 request directly
      // rather than hoping a viewport scroll triggers it.
      expect(pendingCallbacks.length).to.be.greaterThan(0);

      flushPendingCallbacks();
      await nextFrame();
      flushComboBox(comboBox);

      const viewport = getViewportItems(comboBox);
      expect(viewport.some((item) => item.index === 300 && !(item.item instanceof ComboBoxPlaceholder))).to.be.true;
    });

    it('should preserve focused index when both items at focusedIndex are placeholders', async () => {
      comboBox.opened = true;
      flushPendingCallbacks();
      await nextFrame();
      flushComboBox(comboBox);

      // Arrow-Up wraps focus to the last index — a placeholder slot,
      // because only page 0 has been drained.
      arrowUpKeyDown(comboBox.inputElement);
      const lastIndex = comboBox._dropdownItems.length - 1;
      expect(comboBox._focusedIndex).to.equal(lastIndex);
      expect(comboBox._dropdownItems[lastIndex]).to.be.instanceof(ComboBoxPlaceholder);

      // Clearing the cache should preserve the focused index,
      // even though it is still a placeholder after the clear.
      comboBox.clearCache();

      expect(comboBox._focusedIndex).to.equal(lastIndex);
    });

    it('should render real content (not placeholders) at the top on reopen after a scroll', async () => {
      // Open, drain page 0, scroll to a far index, drain its page, then close.
      comboBox.opened = true;
      flushPendingCallbacks();
      await nextFrame();
      comboBox.__focusIndex(300);
      flushComboBox(comboBox);
      await nextFrame();
      flushPendingCallbacks();
      await nextFrame();
      flushComboBox(comboBox);

      // Simulate the real close timing where the overlay has been hidden
      // before the close observer runs (offsetHeight=0 makes the virtualizer's
      // own scroll API a no-op, so the close-time reset is the only thing
      // that prevents the next open from rendering at the stale offset).
      comboBox._scroller.style.display = 'none';
      comboBox.opened = false;
      await nextFrame();
      comboBox._scroller.style.display = '';
      comboBox.opened = true;
      flushComboBox(comboBox);

      // Without the reset the dropdown reopens scrolled into the un-cached
      // range (page ~6), where every visible item is a `ComboBoxPlaceholder`
      // until the user manually scrolls and triggers a fresh page request.
      const viewport = getViewportItems(comboBox);
      expect(viewport[0].index).to.equal(0);
      expect(viewport.every((item) => !(item.item instanceof ComboBoxPlaceholder))).to.be.true;
    });
  });
});
