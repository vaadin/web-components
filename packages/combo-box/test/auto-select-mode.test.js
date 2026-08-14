import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { getFocusedItemIndex, setInputValue } from './helpers.js';

describe('auto-select-mode', () => {
  let comboBox, input;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    await nextRender();
    input = comboBox.inputElement;
  });

  describe('full-match (default)', () => {
    beforeEach(() => {
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should be full-match by default', () => {
      expect(comboBox.autoSelectMode).to.equal('full-match');
    });

    it('should not highlight the first matching item', () => {
      setInputValue(comboBox, 'gra');

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });
  });

  describe('first-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'first-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the first matching item', () => {
      setInputValue(comboBox, 'gra');

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should highlight the exact match instead of the first matching item', () => {
      setInputValue(comboBox, 'grape');

      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should not highlight any item when the filter is empty', () => {
      comboBox.open();

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should not focus any item when no item matches the filter', () => {
      setInputValue(comboBox, 'xyz');

      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should not highlight the first matching item when custom values are allowed', () => {
      comboBox.allowCustomValue = true;

      setInputValue(comboBox, 'gra');

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should remove the highlight on Escape', async () => {
      input.focus();
      setInputValue(comboBox, 'gra');

      await sendKeys({ press: 'Escape' });

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should start keyboard navigation from the highlighted item', async () => {
      input.focus();
      setInputValue(comboBox, 'gra');

      await sendKeys({ press: 'ArrowDown' });

      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });
  });

  describe('only-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'only-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should not highlight the first matching item when multiple items match', () => {
      setInputValue(comboBox, 'gra');

      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should highlight the item when only one item matches', () => {
      setInputValue(comboBox, 'ban');

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should highlight the exact match when multiple items match', () => {
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

    it('should highlight the first matching item after the page is loaded', async () => {
      comboBox.autoSelectMode = 'first-match';

      setInputValue(comboBox, 'gra');
      await aTimeout(0);

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should highlight the only matching item after the page is loaded', async () => {
      comboBox.autoSelectMode = 'only-match';

      setInputValue(comboBox, 'ban');
      await aTimeout(0);

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });
  });
});
