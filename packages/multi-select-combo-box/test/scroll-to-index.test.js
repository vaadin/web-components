import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-multi-select-combo-box.js';

describe('scrollToIndex', () => {
  let comboBox;

  describe('items array', () => {
    const SIZE = 200;

    beforeEach(async () => {
      comboBox = fixtureSync(`
        <vaadin-multi-select-combo-box
          style="--vaadin-multi-select-combo-box-overlay-max-height: 400px"
        ></vaadin-multi-select-combo-box>
      `);
      await nextRender();
      comboBox.items = Array.from({ length: SIZE }, (_, i) => `item ${i}`);
    });

    it('should set the focused index to the given index when opened', () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(100);
      expect(comboBox._focusedIndex).to.equal(100);
    });

    it('should queue the scroll when called before opening', async () => {
      comboBox.scrollToIndex(100);
      expect(comboBox._focusedIndex).to.equal(-1);

      comboBox.opened = true;
      await nextRender();

      expect(comboBox._focusedIndex).to.equal(100);
    });

    it('should clear pending scroll when filter changes', () => {
      comboBox.scrollToIndex(100);
      comboBox.filter = 'item 1';
      expect(comboBox.__scrollToPendingIndex).to.be.undefined;
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

    it('should ignore indexes beyond the item count', () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(SIZE + 50);
      expect(comboBox._focusedIndex).to.equal(-1);
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
        const allItems = Array.from({ length: SIZE }, (_, i) => `item ${i}`);
        const items = allItems.slice(params.page * params.pageSize, (params.page + 1) * params.pageSize);
        callback(items, SIZE);
      });
    };

    beforeEach(async () => {
      pendingCallbacks = [];
      comboBox = fixtureSync(`
        <vaadin-multi-select-combo-box
          style="--vaadin-multi-select-combo-box-overlay-max-height: 400px"
        ></vaadin-multi-select-combo-box>
      `);
      await nextRender();
      comboBox.pageSize = PAGE_SIZE;
      comboBox.dataProvider = asyncDataProvider;
    });

    it('should queue the scroll while the first page is loading', async () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(30);
      expect(comboBox.__scrollToPendingIndex).to.equal(30);

      flushPendingCallbacks();
      await nextFrame();

      expect(comboBox._focusedIndex).to.equal(30);
    });
  });
});
