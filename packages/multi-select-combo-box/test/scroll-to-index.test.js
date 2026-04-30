import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-multi-select-combo-box.js';
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';
import { flushComboBox, getViewportItems } from './helpers.js';

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

    it('should scroll to the item at the given index when opened', () => {
      comboBox.opened = true;
      comboBox.scrollToIndex(100);
      flushComboBox(comboBox);
      const viewport = getViewportItems(comboBox);
      expect(viewport.map((item) => item.index)).to.include(100);
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

    it('should clear pending scroll when filter changes', () => {
      comboBox.scrollToIndex(100);
      comboBox.filter = 'item 1';
      expect(comboBox.__scrollToPendingIndex).to.be.undefined;
    });

    [-1, Number.NaN, SIZE + 50].forEach((invalidIndex) => {
      it(`should ignore invalid index: ${String(invalidIndex)}`, () => {
        comboBox.opened = true;
        comboBox.scrollToIndex(invalidIndex);
        flushComboBox(comboBox);
        expect(getViewportItems(comboBox)[0].index).to.equal(0);
      });
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
  });
});
