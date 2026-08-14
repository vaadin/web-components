import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-multi-select-combo-box.js';
import { getAllItems, setInputValue } from './helpers.js';

describe('auto-select-mode', () => {
  let comboBox;

  function getFocusedItemIndex() {
    return getAllItems(comboBox).findIndex((item) => item.hasAttribute('focused'));
  }

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
    await nextRender();
    comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
  });

  describe('first-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'first-match';
    });

    it('should highlight the first matching item', () => {
      setInputValue(comboBox, 'gra');

      expect(getFocusedItemIndex()).to.equal(0);
    });

    it('should highlight the exact match instead of the first matching item', () => {
      setInputValue(comboBox, 'grape');

      expect(getFocusedItemIndex()).to.equal(1);
    });

    it('should not focus any item when no item matches the filter', () => {
      setInputValue(comboBox, 'xyz');

      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should not highlight the first matching item when custom values are allowed', () => {
      comboBox.allowCustomValue = true;

      setInputValue(comboBox, 'gra');

      expect(getFocusedItemIndex()).to.equal(-1);
    });
  });

  describe('only-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'only-match';
    });

    it('should not highlight the first matching item when multiple items match', () => {
      setInputValue(comboBox, 'gra');

      expect(getFocusedItemIndex()).to.equal(-1);
    });

    it('should highlight the item when only one item matches', () => {
      setInputValue(comboBox, 'ban');

      expect(getFocusedItemIndex()).to.equal(0);
    });
  });
});
