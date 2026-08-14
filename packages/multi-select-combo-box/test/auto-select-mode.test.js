import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-multi-select-combo-box.js';
import { getAllItems } from './helpers.js';

describe('auto-select-mode', () => {
  let comboBox, inputElement;

  function getFocusedItemIndex() {
    return getAllItems(comboBox).findIndex((item) => item.hasAttribute('focused'));
  }

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
    await nextRender();
    comboBox.items = ['apple', 'banana', 'grapefruit', 'grape'];
    inputElement = comboBox.inputElement;
    inputElement.focus();
  });

  describe('first-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'first-match';
    });

    it('should highlight the first matching item while typing', async () => {
      await sendKeys({ type: 'gra' });

      expect(getFocusedItemIndex()).to.equal(0);
    });

    it('should select the first matching item on Enter', async () => {
      await sendKeys({ type: 'gra' });

      await sendKeys({ press: 'Enter' });

      expect(comboBox.selectedItems).to.deep.equal(['grapefruit']);
    });

    it('should select the exact match instead of the first matching item', async () => {
      await sendKeys({ type: 'grape' });

      await sendKeys({ press: 'Enter' });

      expect(comboBox.selectedItems).to.deep.equal(['grape']);
    });

    it('should not select anything on Enter when no item matches the filter', async () => {
      await sendKeys({ type: 'xyz' });

      await sendKeys({ press: 'Enter' });

      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should not highlight the first matching item when custom values are allowed', async () => {
      comboBox.allowCustomValue = true;

      await sendKeys({ type: 'gra' });

      expect(getFocusedItemIndex()).to.equal(-1);
    });
  });

  describe('only-match', () => {
    beforeEach(() => {
      comboBox.autoSelectMode = 'only-match';
    });

    it('should not highlight the first item when multiple items match', async () => {
      await sendKeys({ type: 'gra' });

      expect(getFocusedItemIndex()).to.equal(-1);
    });

    it('should not select anything on Enter when multiple items match', async () => {
      await sendKeys({ type: 'gra' });

      await sendKeys({ press: 'Enter' });

      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should select the only matching item on Enter', async () => {
      await sendKeys({ type: 'ban' });

      await sendKeys({ press: 'Enter' });

      expect(comboBox.selectedItems).to.deep.equal(['banana']);
    });
  });
});
