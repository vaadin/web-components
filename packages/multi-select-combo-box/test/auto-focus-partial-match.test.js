import { expect } from '@vaadin/chai-plugins';
import { arrowDownKeyDown, enterKeyDown, fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import '../src/vaadin-multi-select-combo-box.js';
import { getAllItems, setInputValue } from './helpers.js';

describe('auto-focus-partial-match', () => {
  let comboBox, inputElement;

  function getFocusedItemIndex() {
    return getAllItems(comboBox).findIndex((item) => item.hasAttribute('focused'));
  }

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
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
      expect(getFocusedItemIndex()).to.equal(1);
    });

    it('should not highlight partial matches', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex()).to.equal(-1);
    });

    describe('committing input', () => {
      it('should not select the partial match on Enter', () => {
        setInputValue(comboBox, 'grap');
        enterKeyDown(inputElement);
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not unselect the already selected partial match on Enter', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grap');
        enterKeyDown(inputElement);
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should not select the partial match on outside click', () => {
        setInputValue(comboBox, 'grap');
        outsideClick();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not unselect the already selected partial match on outside click', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grap');
        outsideClick();
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should select the clicked item', () => {
        setInputValue(comboBox, 'grap');
        getAllItems(comboBox)[0].click();
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should unselect the already selected clicked item', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grap');
        getAllItems(comboBox)[0].click();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });
    });
  });

  describe('first-match', () => {
    beforeEach(() => {
      comboBox.autoFocusPartialMatch = 'first-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight first partial match', () => {
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex()).to.equal(0);
    });

    it('should highlight the exact match when there is one', () => {
      setInputValue(comboBox, 'grape');
      expect(getFocusedItemIndex()).to.equal(1);
    });

    it('should not highlight first partial match when custom values are allowed', () => {
      comboBox.allowCustomValue = true;
      setInputValue(comboBox, 'gra');
      expect(getFocusedItemIndex()).to.equal(-1);
    });

    it('should not highlight anything when the filter is empty', () => {
      comboBox.open();
      expect(getFocusedItemIndex()).to.equal(-1);
    });

    describe('committing input', () => {
      it('should select first partial match on Enter', () => {
        setInputValue(comboBox, 'grap');
        enterKeyDown(inputElement);
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should not unselect the already selected first partial match on Enter', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grap');
        enterKeyDown(inputElement);
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should clear the input value on Enter when keeping the item selected', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grap');
        enterKeyDown(inputElement);
        expect(inputElement.value).to.equal('');
        expect(comboBox.filter).to.equal('');
      });

      it('should unselect the already selected item on Enter after highlighting it with arrow keys', () => {
        comboBox.selectedItems = ['grape'];
        setInputValue(comboBox, 'grap');
        // Move the highlight from `grapefruit` to `grape`.
        arrowDownKeyDown(inputElement);
        enterKeyDown(inputElement);
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not change the selection on Enter when no items match', () => {
        setInputValue(comboBox, 'xyz');
        enterKeyDown(inputElement);
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not select first partial match on outside click', () => {
        setInputValue(comboBox, 'grap');
        outsideClick();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not unselect the already selected first partial match on outside click', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grap');
        outsideClick();
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should select the clicked item instead of first partial match', () => {
        setInputValue(comboBox, 'grap');
        getAllItems(comboBox)[1].click();
        expect(comboBox.selectedItems).to.deep.equal(['grape']);
      });

      it('should unselect the already selected clicked item', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grap');
        getAllItems(comboBox)[0].click();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });
    });
  });

  describe('only-match', () => {
    beforeEach(() => {
      comboBox.autoFocusPartialMatch = 'only-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight only partial match', () => {
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

    describe('committing input', () => {
      it('should select only partial match on Enter', () => {
        setInputValue(comboBox, 'grapef');
        enterKeyDown(inputElement);
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should not unselect the already selected only partial match on Enter', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grapef');
        enterKeyDown(inputElement);
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should not change the selection on Enter when multiple items match', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grap');
        enterKeyDown(inputElement);
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should not select only partial match on outside click', () => {
        setInputValue(comboBox, 'grapef');
        outsideClick();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not unselect the already selected only partial match on outside click', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grapef');
        outsideClick();
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should select the clicked item', () => {
        setInputValue(comboBox, 'grapef');
        getAllItems(comboBox)[0].click();
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should unselect the already selected clicked item', () => {
        comboBox.selectedItems = ['grapefruit'];
        setInputValue(comboBox, 'grapef');
        getAllItems(comboBox)[0].click();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });
    });
  });
});
