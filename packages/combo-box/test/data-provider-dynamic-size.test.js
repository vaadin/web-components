import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { ComboBoxPlaceholder } from '../src/vaadin-combo-box-placeholder.js';
import { flushComboBox, getViewportItems, getVisibleItemsCount, makeItems, scrollToIndex } from './helpers.js';

describe('data provider dynamic size', () => {
  let comboBox;

  describe('size is reduced once scrolled to end', () => {
    const INITIAL_SIZE = 600;
    const ACTUAL_SIZE = 500;

    function dataProvider(params, callback) {
      const items = new Array(params.pageSize).fill().map((_, i) => {
        return {
          label: `Item ${params.pageSize * params.page + i}`,
        };
      });

      let size = ACTUAL_SIZE;
      if (!comboBox.size || comboBox.size === INITIAL_SIZE) {
        // Pages may be requested not sequentially.
        // Not to change combobox's size, if once changed to actual value
        size = params.page > ACTUAL_SIZE / params.pageSize - 1 ? ACTUAL_SIZE : INITIAL_SIZE;
      }

      callback(items, size);
    }

    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.dataProvider = dataProvider;
      await nextRender();
    });

    it('should not have item placeholders after size gets reduced', async () => {
      comboBox.opened = true;
      scrollToIndex(comboBox, comboBox.size - 1);
      flushComboBox(comboBox);
      await nextFrame();
      flushComboBox(comboBox);
      await nextFrame();
      const items = getViewportItems(comboBox);
      expect(items.length).to.be.above(5);
      items.forEach((item) => {
        expect(item.textContent).to.be.ok;
      });
    });
  });

  describe('undefined size', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
    });

    it('should restore the scroll position after size update', () => {
      const estimatedSize = 1234;
      const targetItemIndex = 75;
      comboBox.dataProvider = (params, callback) => {
        const items = makeItems(estimatedSize);
        const offset = params.page * params.pageSize;
        callback(items.slice(offset, offset + params.pageSize), items.length);
      };
      comboBox.opened = true;
      comboBox._scrollIntoView(targetItemIndex);
      comboBox.size = 300;
      // Verify whether the scroller not jumped to 0 pos and restored properly,
      // having the item with 'targetItemIndex' in the bottom
      // (exact visible items may vary depending of window size),
      // and sometimes the 'ironList.scrollToIndex' does not point
      // precisely to the given index, so use some margin
      const scrollMargin = 5;
      const expectedFirstVisibleIndex = targetItemIndex - getVisibleItemsCount(comboBox) - scrollMargin;
      expect(getViewportItems(comboBox)[0].index).to.be.greaterThan(expectedFirstVisibleIndex);
      expect(getViewportItems(comboBox).pop().index).to.be.lessThan(targetItemIndex + 1);
    });

    // Verifies https://github.com/vaadin/vaadin-combo-box/issues/957
    it('should fetch the items after scrolling to the bottom with scrollbar', async () => {
      const realSize = 1234;
      let estimatedSize = 200;

      // DataProvider for unknown size lazy loading
      comboBox.dataProvider = (params, callback) => {
        const offset = params.page * params.pageSize;
        const items = makeItems(realSize);
        const itemsSlice = items.slice(offset, offset + params.pageSize);
        if (itemsSlice.size === 0) {
          estimatedSize = offset;
        } else if (itemsSlice.size < params.pageSize) {
          estimatedSize = offset + itemsSlice.size;
        } else if (offset + params.pageSize > estimatedSize - params.pageSize) {
          estimatedSize += 200;
        }
        callback(itemsSlice, estimatedSize);
      };
      comboBox.opened = true;

      // Scroll to the end, as though if we drag the scrollbar and move it
      // to the bottom
      const scrollHeight = comboBox._scroller._scrollHeight;
      comboBox._scroller.scrollTop += scrollHeight;

      // Flush the pending changes after the scrolling
      await nextFrame();

      const lastVisibleIndex = getViewportItems(comboBox).pop().index;
      // Check if the next few items after the last visible item are not empty
      for (let nextIndexIncrement = 0; nextIndexIncrement < 5; nextIndexIncrement++) {
        const lastItem = comboBox.filteredItems[lastVisibleIndex + nextIndexIncrement];
        expect(lastItem instanceof ComboBoxPlaceholder).is.false;
      }
    });

    it('should not show the loading when exact size is suddenly reached in the middle of requested range', async () => {
      const realSize = 294;
      const estimatedSize = 400;

      let lastPageAlreadyRequested = false;

      comboBox.size = estimatedSize;

      // Simulates a combo-box server side data provider specifics with
      // undefined size
      comboBox.dataProvider = (params, callback) => {
        const offset = params.page * params.pageSize;
        const items = makeItems(realSize);
        const itemsSlice = items.slice(offset, offset + params.pageSize);

        // Combo box server side always notifies about size change
        comboBox.size = params.page < 5 ? estimatedSize : realSize;

        if (params.page < 5) {
          callback(itemsSlice, estimatedSize);
        } else if (params.page === 5) {
          // Combo box server side does not update the client with the
          // items which were sent recently
          if (!lastPageAlreadyRequested) {
            callback(itemsSlice, realSize);
            lastPageAlreadyRequested = true;
          }
        }
      };
      comboBox.open();
      // Scroll to last page and verify there is no loading indicator and
      // the last page has been fetched and rendered
      comboBox._scrollIntoView(274);
      await nextFrame();
      expect(comboBox.loading).to.be.false;
      expect(comboBox.filteredItems).to.contain('item 293');
    });
  });
});
