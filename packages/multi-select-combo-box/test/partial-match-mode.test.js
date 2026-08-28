import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import '../src/vaadin-multi-select-combo-box.js';
import { getAllItems } from './helpers.js';

describe('partial-match-mode', () => {
  let comboBox, inputElement;

  function getFocusedItemIndex() {
    return getAllItems(comboBox).findIndex((item) => item.hasAttribute('focused'));
  }

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
    await nextRender();
    inputElement = comboBox.inputElement;
    inputElement.focus();
  });

  describe('none (default)', () => {
    beforeEach(() => {
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should be none by default', () => {
      expect(comboBox.partialMatchMode).to.equal('none');
    });

    it('should highlight the exact match', async () => {
      await sendKeys({ type: 'grape' });
      expect(getFocusedItemIndex()).to.equal(1);
    });

    it('should not highlight partial matches', async () => {
      await sendKeys({ type: 'gra' });
      expect(getFocusedItemIndex()).to.equal(-1);
    });

    describe('value commit', () => {
      it('should select the exact match on Enter', async () => {
        await sendKeys({ type: 'grape' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.selectedItems).to.deep.equal(['grape']);
      });

      it('should not select the exact match on outside click', async () => {
        await sendKeys({ type: 'grape' });
        outsideClick();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not select the partial match on Enter', async () => {
        await sendKeys({ type: 'grap' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.selectedItems).to.deep.equal([]);
      });
    });
  });

  describe('first-match', () => {
    beforeEach(() => {
      comboBox.partialMatchMode = 'first-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the first partial match', async () => {
      await sendKeys({ type: 'gra' });
      expect(getFocusedItemIndex()).to.equal(0);
    });

    it('should highlight the exact match when there is one', async () => {
      await sendKeys({ type: 'grape' });
      expect(getFocusedItemIndex()).to.equal(1);
    });

    it('should not highlight the first partial match when custom values are allowed', async () => {
      comboBox.allowCustomValue = true;
      await sendKeys({ type: 'gra' });
      expect(getFocusedItemIndex()).to.equal(-1);
    });

    it('should not highlight anything when the filter is empty', () => {
      comboBox.open();
      expect(getFocusedItemIndex()).to.equal(-1);
    });

    describe('value commit', () => {
      it('should select the first partial match on Enter', async () => {
        await sendKeys({ type: 'grap' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should unselect the already selected item on Enter after highlighting it with arrow keys', async () => {
        comboBox.selectedItems = ['grape'];
        await sendKeys({ type: 'grap' });
        // Move the highlight from `grapefruit` to `grape`.
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not change the selection on Enter when no items match', async () => {
        await sendKeys({ type: 'xyz' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      it('should not select the first partial match on outside click', async () => {
        await sendKeys({ type: 'grap' });
        outsideClick();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });

      describe('committing the same partial match again', () => {
        beforeEach(async () => {
          comboBox.selectedItems = ['grapefruit'];
          await sendKeys({ type: 'grap' });
        });

        it('should not unselect the item on Enter', async () => {
          await sendKeys({ press: 'Enter' });
          expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
        });

        it('should keep the input value on Enter', async () => {
          await sendKeys({ press: 'Enter' });
          expect(inputElement.value).to.equal('grap');
          expect(comboBox.filter).to.equal('grap');
        });

        it('should not unselect the item on outside click', () => {
          outsideClick();
          expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
        });
      });
    });
  });

  describe('only-match', () => {
    beforeEach(() => {
      comboBox.partialMatchMode = 'only-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should highlight the only partial match', async () => {
      await sendKeys({ type: 'ban' });
      expect(getFocusedItemIndex()).to.equal(0);
    });

    it('should not highlight anything when multiple items match', async () => {
      await sendKeys({ type: 'gra' });
      expect(getFocusedItemIndex()).to.equal(-1);
    });

    it('should highlight the exact match when there is one', async () => {
      await sendKeys({ type: 'grape' });
      expect(getFocusedItemIndex()).to.equal(1);
    });

    describe('value commit', () => {
      it('should select the only partial match on Enter', async () => {
        await sendKeys({ type: 'grapef' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });

      it('should not change the selection on Enter when multiple items match', async () => {
        comboBox.selectedItems = ['grapefruit'];
        await sendKeys({ type: 'grap' });
        await sendKeys({ press: 'Enter' });
        expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
      });
    });
  });

  describe('autoOpenDisabled', () => {
    beforeEach(() => {
      comboBox.autoOpenDisabled = true;
      comboBox.partialMatchMode = 'first-match';
      comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    });

    it('should select the exact match on Enter while closed', async () => {
      await sendKeys({ type: 'grape' });
      await sendKeys({ press: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['grape']);
    });

    it('should not select the first partial match on Enter while closed', async () => {
      await sendKeys({ type: 'grap' });
      await sendKeys({ press: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should highlight the first partial match when opening the dropdown after typing', async () => {
      await sendKeys({ type: 'grap' });
      await sendKeys({ press: 'ArrowDown' });
      expect(getFocusedItemIndex()).to.equal(0);
    });

    it('should select the first partial match on Enter after opening the dropdown', async () => {
      await sendKeys({ type: 'grap' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
    });
  });
});
