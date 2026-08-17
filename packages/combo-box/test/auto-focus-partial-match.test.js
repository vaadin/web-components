import { expect } from '@vaadin/chai-plugins';
import { aTimeout, enterKeyDown, fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { clickItem, getFocusedItemIndex, setInputValue } from './helpers.js';

describe('auto-focus-partial-match', () => {
  let comboBox, inputElement;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    await nextRender();
    inputElement = comboBox.inputElement;
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
      expect(getFocusedItemIndex(comboBox)).to.equal(1);
    });

    it('should not highlight partial matches', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    describe('committing input', () => {
      it('should not commit the partial match on Enter', () => {
        setInputValue(comboBox, 'grap');
        enterKeyDown(inputElement);
        expect(comboBox.value).to.equal('');
      });

      it('should not commit the partial match on outside click', () => {
        setInputValue(comboBox, 'grap');
        outsideClick();
        expect(comboBox.value).to.equal('');
      });

      it('should commit the clicked item', () => {
        setInputValue(comboBox, 'grap');
        clickItem(comboBox, 0);
        expect(comboBox.value).to.equal('grapefruit');
      });
    });
  });

  describe('first-match', () => {
    beforeEach(() => {
      comboBox.autoFocusPartialMatch = 'first-match';
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

    describe('committing input', () => {
      it('should commit the first match on Enter', () => {
        setInputValue(comboBox, 'grap');
        enterKeyDown(inputElement);
        expect(comboBox.value).to.equal('grapefruit');
      });

      it('should not commit on Enter when no items match', () => {
        setInputValue(comboBox, 'xyz');
        enterKeyDown(inputElement);
        expect(comboBox.value).to.equal('');
      });

      it('should commit the first match on outside click', () => {
        setInputValue(comboBox, 'grap');
        outsideClick();
        expect(comboBox.value).to.equal('grapefruit');
      });

      it('should commit the clicked item instead of the first match', () => {
        setInputValue(comboBox, 'grap');
        clickItem(comboBox, 1);
        expect(comboBox.value).to.equal('grape');
      });
    });
  });

  describe('only-match', () => {
    beforeEach(() => {
      comboBox.autoFocusPartialMatch = 'only-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the only match', () => {
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

    describe('committing input', () => {
      it('should commit the only match on Enter', () => {
        setInputValue(comboBox, 'grapef');
        enterKeyDown(inputElement);
        expect(comboBox.value).to.equal('grapefruit');
      });

      it('should not commit on Enter when multiple items match', () => {
        setInputValue(comboBox, 'grap');
        enterKeyDown(inputElement);
        expect(comboBox.value).to.equal('');
      });

      it('should commit the only match on outside click', () => {
        setInputValue(comboBox, 'grapef');
        outsideClick();
        expect(comboBox.value).to.equal('grapefruit');
      });

      it('should not commit on outside click when multiple items match', () => {
        setInputValue(comboBox, 'grap');
        outsideClick();
        expect(comboBox.value).to.equal('');
      });

      it('should commit the clicked item', () => {
        setInputValue(comboBox, 'grapef');
        clickItem(comboBox, 0);
        expect(comboBox.value).to.equal('grapefruit');
      });
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
      comboBox.autoFocusPartialMatch = 'first-match';

      setInputValue(comboBox, 'gra');
      await aTimeout(0);

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should highlight the only match after the page is loaded', async () => {
      comboBox.autoFocusPartialMatch = 'only-match';

      setInputValue(comboBox, 'ban');
      await aTimeout(0);

      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });
  });
});
