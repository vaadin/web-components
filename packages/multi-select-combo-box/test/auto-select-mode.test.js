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

    it('should highlight the first match', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex()).to.equal(0);
    });

    it('should prefer the exact match over the first match', () => {
      setInputValue(comboBox, 'grape');
      expect(getFocusedItemIndex()).to.equal(1);
    });

    it('should not highlight anything when no items match', () => {
      setInputValue(comboBox, 'xyz');
      expect(comboBox._focusedIndex).to.equal(-1);
    });

    it('should not highlight the first match when custom values are allowed', () => {
      comboBox.allowCustomValue = true;
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex()).to.equal(-1);
    });
  });

  describe('only-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'only-match';
    });

    it('should highlight the only match', () => {
      setInputValue(comboBox, 'ban');
      expect(getFocusedItemIndex()).to.equal(0);
    });

    it('should not highlight anything when multiple items match', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex()).to.equal(-1);
    });
  });
});
