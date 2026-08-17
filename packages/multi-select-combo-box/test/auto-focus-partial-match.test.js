import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-multi-select-combo-box.js';
import { getAllItems, setInputValue } from './helpers.js';

describe('auto-focus-partial-match', () => {
  let comboBox;

  function getFocusedItemIndex() {
    return getAllItems(comboBox).findIndex((item) => item.hasAttribute('focused'));
  }

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
    await nextRender();
  });

  describe('none (default)', () => {
    beforeEach(() => {
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should be none by default', () => {
      expect(comboBox.autoFocusPartialMatch).to.equal('none');
    });

    it('should highlight the exact match', () => {
      setInputValue(comboBox, 'grape');
      expect(getFocusedItemIndex()).to.equal(1);
    });

    it('should not highlight partial matches', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex()).to.equal(-1);
    });
  });

  describe('first-match', () => {
    beforeEach(() => {
      comboBox.autoFocusPartialMatch = 'first-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the first match', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex()).to.equal(0);
    });

    it('should highlight the exact match when there is one', () => {
      setInputValue(comboBox, 'grape');
      expect(getFocusedItemIndex()).to.equal(1);
    });

    it('should not highlight the first match when custom values are allowed', () => {
      comboBox.allowCustomValue = true;
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex()).to.equal(-1);
    });

    it('should not highlight anything when the filter is empty', () => {
      comboBox.open();
      expect(getFocusedItemIndex()).to.equal(-1);
    });

    it('should not highlight anything when no items match', () => {
      setInputValue(comboBox, 'xyz');
      expect(comboBox._focusedIndex).to.equal(-1);
    });
  });

  describe('only-match', () => {
    beforeEach(() => {
      comboBox.autoFocusPartialMatch = 'only-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the only match', () => {
      setInputValue(comboBox, 'ban');
      expect(getFocusedItemIndex()).to.equal(0);
    });

    it('should not highlight anything when multiple items match', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex()).to.equal(-1);
    });

    it('should highlight the exact match when there is one', () => {
      setInputValue(comboBox, 'grape');
      expect(getFocusedItemIndex()).to.equal(1);
    });
  });
});
