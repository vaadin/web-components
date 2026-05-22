import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { ComboBoxPlaceholder } from '../src/vaadin-combo-box-placeholder.js';
import { flushComboBox, getViewportItems, makeItems } from './helpers.js';

describe('scrollToIndex', () => {
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
      comboBox.scrollToIndex(100);
      flushComboBox(comboBox);
      const viewport = getViewportItems(comboBox);
      expect(viewport.map((item) => item.index)).to.include(100);
    });

    it('should set the focused index to the given index', () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(100);
      expect(comboBox._focusedIndex).to.equal(100);
    });

    it('should queue the scroll when called before opening', async () => {
      comboBox.scrollToIndex(100);
      expect(comboBox.__scrollToPendingIndex).to.equal(100);

      comboBox.opened = true;
      await nextFrame();
      flushComboBox(comboBox);

      const viewport = getViewportItems(comboBox);
      expect(viewport.map((item) => item.index)).to.include(100);
    });

    it('should update aria-activedescendant after scrolling', async () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(100);
      flushComboBox(comboBox);
      await nextFrame();
      const activeId = comboBox.inputElement.getAttribute('aria-activedescendant');
      expect(activeId).to.be.ok;
      const item = comboBox._scroller.querySelector(`#${activeId}`);
      expect(item.index).to.equal(100);
    });

    it('should clear pending scroll when filter changes', () => {
      comboBox.scrollToIndex(100);
      comboBox.filter = 'item 1';
      comboBox.opened = true;
      flushComboBox(comboBox);
      const viewport = getViewportItems(comboBox);
      expect(viewport[0].index).to.equal(0);
    });

    [-1, Number.NaN, '100', SIZE + 50].forEach((invalidIndex) => {
      it(`should ignore invalid index: ${String(invalidIndex)}`, () => {
        comboBox.opened = true;
        comboBox.scrollToIndex(invalidIndex);
        flushComboBox(comboBox);
        expect(getViewportItems(comboBox)[0].index).to.equal(0);
      });
    });

    it('should override a previous scroll call', () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(50);
      comboBox.scrollToIndex(150);
      flushComboBox(comboBox);
      const viewport = getViewportItems(comboBox);
      expect(viewport.map((item) => item.index)).to.include(150);
    });

    it('should scroll to 0', () => {
      comboBox.opened = true;
      comboBox._scrollIntoView(SIZE - 1);
      flushComboBox(comboBox);
      comboBox.scrollToIndex(0);
      flushComboBox(comboBox);
      expect(getViewportItems(comboBox)[0].index).to.equal(0);
    });

    it('should not auto-scroll on open when scrollToIndex was never called', () => {
      comboBox.selectedItem = comboBox.items[100];

      comboBox.opened = true;
      flushComboBox(comboBox);

      // PR #6055: opening with a mid-list selectedItem must not auto-scroll.
      const viewport = getViewportItems(comboBox);
      expect(viewport[0].index).to.equal(0);
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
      comboBox.scrollToIndex(30);
      expect(comboBox.__scrollToPendingIndex).to.equal(30);

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

      comboBox.scrollToIndex(300);
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
      comboBox.scrollToIndex(300);
      expect(comboBox.__scrollToPendingIndex).to.equal(300);

      comboBox.filter = 'item 1';
      expect(comboBox.__scrollToPendingIndex).to.be.undefined;
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
      // signal that index 300 was requested has to come from `scrollToIndex`
      // itself, via its placeholder branch.
      comboBox.scrollToIndex(300);
      expect(comboBox.__scrollToPendingIndex).to.equal(300);

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

    it('should preserve focused index when a sibling page loads (object items)', async () => {
      // Object items without `itemValuePath` set — `_getItemValue` falls back
      // to `item.toString()` ("[object Object]"), so the value-lookup focus
      // preservation in `_setDropdownItems` collapses across all object items.
      // Without the same-reference short-circuit, a sibling page-load after
      // scrollToIndex would reset `_focusedIndex` to 0.
      const objectItems = Array.from({ length: SIZE }, (_, i) => ({ key: `k${i}`, label: `Item ${i}` }));
      const objectDataProvider = (params, callback) => {
        pendingCallbacks.push(() => {
          const slice = objectItems.slice(params.page * params.pageSize, (params.page + 1) * params.pageSize);
          callback(slice, SIZE);
        });
      };

      comboBox.itemLabelPath = 'label';
      comboBox.itemIdPath = 'key';
      comboBox.dataProvider = objectDataProvider;
      comboBox.opened = true;

      // Drain the first page so index 30 is loaded.
      flushPendingCallbacks();
      await nextFrame();
      flushComboBox(comboBox);

      comboBox.scrollToIndex(30);
      flushComboBox(comboBox);
      await nextFrame();
      expect(comboBox._focusedIndex).to.equal(30);

      // Trigger a sibling page-load. `__onDataProviderPageLoaded` will call
      // `_setDropdownItems` with a fresh array reference, but the item at
      // index 30 is unchanged, so focus must stick.
      comboBox.__dataProviderController.ensureFlatIndexLoaded(300);
      flushPendingCallbacks();
      await nextFrame();
      flushComboBox(comboBox);

      expect(comboBox._focusedIndex).to.equal(30);
    });

    it('should render real content (not placeholders) at the top on reopen after a scroll', async () => {
      // Open, drain page 0, scroll to a far index, drain its page, then close.
      comboBox.opened = true;
      flushPendingCallbacks();
      await nextFrame();
      comboBox.scrollToIndex(300);
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
