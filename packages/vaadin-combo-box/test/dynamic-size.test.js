import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { flushComboBox, getViewportItems, scrollToIndex } from './helpers.js';
import '../src/vaadin-combo-box.js';
import './not-animated-styles.js';

describe('dynamic size change', () => {
  describe('reduce size once scrolled to end', () => {
    let comboBox;
    const INITIAL_SIZE = 600;
    const ACTUAL_SIZE = 500;

    function dataProvider(params, callback) {
      const items = Array(...new Array(params.pageSize)).map((_, i) => {
        return {
          label: 'Item ' + (params.pageSize * params.page + i)
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

    beforeEach(() => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.dataProvider = dataProvider;
    });

    it('should not have item placeholders after size gets reduced', async () => {
      comboBox.opened = true;
      await nextRender(comboBox.$.overlay);
      scrollToIndex(comboBox, comboBox.size - 1);
      flushComboBox(comboBox);
      const items = getViewportItems(comboBox);
      expect(items.length).to.be.above(5);
      items.forEach((item) => {
        expect(item.$.content.textContent).to.be.ok;
      });
    });
  });
});
