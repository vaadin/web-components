import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { getFocusedItemIndex, setInputValue } from './helpers.js';

describe('auto-select-mode', () => {
  let comboBox;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    await nextRender();
  });

  describe('exact-match (default)', () => {
    beforeEach(() => {
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should be exact-match by default', () => {
      expect(comboBox.autoSelectMode).to.equal('exact-match');
    });

    it('should highlight the exact match', () => {
      setInputValue(comboBox, 'grape');
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should not highlight partial matches', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });
  });

  describe('first-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'first-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the first match', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should highlight the exact match when there is one', () => {
      setInputValue(comboBox, 'grape');
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should not highlight the first match when custom values are allowed', () => {
      comboBox.allowCustomValue = true;
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should not highlight anything when the filter is empty', () => {
      comboBox.open();
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should not highlight anything when no items match', () => {
      setInputValue(comboBox, 'xyz');
      expect(comboBox._focusedIndex).to.equal(-1);
    });
  });

  describe('single-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'single-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the single match', () => {
      setInputValue(comboBox, 'ban');
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should not highlight anything when multiple items match', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should highlight the exact match when there is one', () => {
      setInputValue(comboBox, 'grape');
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });
  });

  describe('lazy loading', () => {
    beforeEach(() => {
      const allItems = ['apple', 'banana', 'grapefruit', 'grape'];
      comboBox.dataProvider = (params, callback) => {
        setTimeout(() => {
          const filteredItems = allItems.filter((item) => item.includes(params.filter));
          callback(filteredItems, filteredItems.length);
        });
      };
    });

    it('should highlight the first match after the page is loaded', async () => {
      comboBox.autoSelectMode = 'first-match';

      setInputValue(comboBox, 'gra');
      await aTimeout(0);

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should highlight the single match after the page is loaded', async () => {
      comboBox.autoSelectMode = 'single-match';

      setInputValue(comboBox, 'ban');
      await aTimeout(0);

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });
  });
});
