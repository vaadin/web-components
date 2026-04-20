import { expect } from '@vaadin/chai-plugins';
import { escKeyDown, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
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
      expect(comboBox._focusedIndex).to.equal(-1);

      comboBox.opened = true;
      await nextFrame();
      flushComboBox(comboBox);

      expect(comboBox._focusedIndex).to.equal(100);
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

    it('should ignore negative indexes', () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(-1);
      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should ignore NaN', () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(NaN);
      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should ignore non-numbers', () => {
      comboBox.opened = true;
      comboBox.scrollToIndex('100');
      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should ignore indexes beyond the item count', () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(SIZE + 50);
      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should override a previous scroll call', () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(50);
      comboBox.scrollToIndex(150);
      flushComboBox(comboBox);
      expect(comboBox._focusedIndex).to.equal(150);
      const viewport = getViewportItems(comboBox);
      expect(viewport.map((item) => item.index)).to.include(150);
    });

    it('should scroll to 0', () => {
      comboBox.opened = true;
      comboBox._scrollIntoView(SIZE - 1);
      flushComboBox(comboBox);
      comboBox.scrollToIndex(0);
      flushComboBox(comboBox);
      expect(comboBox._focusedIndex).to.equal(0);
      expect(getViewportItems(comboBox)[0].index).to.equal(0);
    });

    it('should reset the virtualizer scroll cache when closing after a scrollToIndex', async () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(150);
      flushComboBox(comboBox);

      const adapter = comboBox._scroller.__virtualizer.__adapter;
      expect(adapter._scrollPosition).to.be.greaterThan(0);

      // Simulate the real-world timing where, by the time the close
      // observer runs, the overlay has already been hidden (offsetHeight=0).
      // That causes the virtualizer's own `scrollToIndex` to bail out
      // before resetting `_scrollPosition`. Without the combo-box's
      // explicit reset, the adapter's ResizeObserver would later restore
      // this stale value to `scrollTop` when the overlay becomes visible
      // again, leaving the reopened dropdown stuck at the previous
      // scroll position (or blank, if items haven't loaded there yet).
      comboBox._scroller.style.display = 'none';
      comboBox.opened = false;
      await nextFrame();

      expect(adapter._scrollPosition).to.equal(0);
      expect(comboBox._scroller.scrollTop).to.equal(0);
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

      expect(comboBox._focusedIndex).to.equal(30);
    });

    it('should scroll to an unloaded index after its page loads', async () => {
      comboBox.opened = true;
      flushPendingCallbacks();
      await nextFrame();

      comboBox.scrollToIndex(300);
      flushComboBox(comboBox);
      // The scroll moves placeholders into view, which request their page via rAF.
      await nextFrame();
      // Drain the page request so the items around index 300 become real.
      flushPendingCallbacks();
      await nextFrame();
      flushComboBox(comboBox);

      expect(comboBox._focusedIndex).to.equal(300);
      const viewport = getViewportItems(comboBox);
      expect(viewport.some((item) => item.index === 300 && !(item.item instanceof ComboBoxPlaceholder))).to.be.true;
    });

    it('should clear pending scroll when filter changes', () => {
      comboBox.scrollToIndex(300);
      expect(comboBox.__scrollToPendingIndex).to.equal(300);

      comboBox.filter = 'item 1';
      expect(comboBox.__scrollToPendingIndex).to.be.undefined;
    });

    it('should not throw when scrollToIndex is called before a data provider is set', () => {
      comboBox.dataProvider = undefined;
      expect(() => comboBox.scrollToIndex(100)).to.not.throw();
    });
  });

  describe('regressions', () => {
    it('should not scroll on open when scrollToIndex was never called', async () => {
      comboBox = fixtureSync(`
        <vaadin-combo-box
          style="--vaadin-combo-box-overlay-max-height: 400px"
        ></vaadin-combo-box>
      `);
      await nextRender();
      comboBox.items = makeItems(200);
      comboBox.selectedItem = comboBox.items[100];

      comboBox.opened = true;
      flushComboBox(comboBox);

      // PR #6055: opening with a mid-list selectedItem should not auto-scroll.
      const viewport = getViewportItems(comboBox);
      expect(viewport[0].index).to.equal(0);
      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should close the overlay on a single Escape press when opened with a selectedItem (flow#5142)', async () => {
      comboBox = fixtureSync(`
        <vaadin-combo-box
          style="--vaadin-combo-box-overlay-max-height: 400px"
        ></vaadin-combo-box>
      `);
      await nextRender();
      comboBox.items = makeItems(200);
      comboBox.selectedItem = comboBox.items[100];

      comboBox.opened = true;
      await nextFrame();
      flushComboBox(comboBox);

      comboBox.inputElement.focus();
      escKeyDown(comboBox.inputElement);
      expect(comboBox.opened).to.be.false;
    });
  });
});
