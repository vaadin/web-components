import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';
import { getAllItems, getDataProvider, getFirstItem } from './helpers.js';

describe('selecting items', () => {
  let comboBox, internal, inputElement;

  beforeEach(() => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
    internal = comboBox.$.comboBox;
    inputElement = comboBox.inputElement;
    inputElement.focus();
  });

  describe('basic', () => {
    beforeEach(() => {
      comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
    });

    it('should update selectedItems when selecting an item on Enter', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should update selectedItems when selecting an item on click', async () => {
      await sendKeys({ down: 'ArrowDown' });
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should not un-select item when typing its value manually', async () => {
      comboBox.selectedItems = ['orange'];
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'orange' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['orange']);
    });

    it('should update has-value attribute on selected items change', () => {
      expect(comboBox.hasAttribute('has-value')).to.be.false;
      comboBox.selectedItems = ['apple', 'banana'];
      expect(comboBox.hasAttribute('has-value')).to.be.true;
    });

    it('should keep has-value attribute after user clears input value', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();
      await sendKeys({ type: 'o' });
      await sendKeys({ down: 'Backspace' });
      expect(comboBox.hasAttribute('has-value')).to.be.true;
    });

    it('should clear internal combo-box value when selecting an item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'apple' });
      await sendKeys({ down: 'Enter' });
      expect(internal.value).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should not fire internal value-changed event when selecting an item', async () => {
      const spy = sinon.spy();
      internal.addEventListener('value-changed', spy);
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'apple' });
      await sendKeys({ down: 'Enter' });
      expect(spy.calledOnce).to.be.false;
    });

    it('should keep overlay open when selecting an item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(internal.opened).to.be.true;
    });

    it('should keep overlay focused index when selecting an item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      expect(item.hasAttribute('focused')).to.be.true;
    });

    it('should keep overlay focused index when entering and committing', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'banana' });
      await sendKeys({ down: 'Enter' });
      const item = document.querySelectorAll('vaadin-multi-select-combo-box-item')[1];
      expect(item.hasAttribute('focused')).to.be.true;
    });

    it('should not unselect previously committed item on focusout', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      await sendKeys({ down: 'Tab' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should un-select item when using clear() method', () => {
      comboBox.selectedItems = ['orange'];
      comboBox.clear();
      expect(comboBox.selectedItems).to.deep.equal([]);
    });
  });

  describe('dataProvider', () => {
    beforeEach(() => {
      comboBox.dataProvider = getDataProvider(['apple', 'banana', 'lemon', 'orange']);
    });

    it('should not un-select item when typing its value manually', async () => {
      comboBox.selectedItems = ['orange'];
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'orange' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['orange']);
    });
  });

  describe('selected items on top', () => {
    function expectItems(values) {
      const items = getAllItems(comboBox);
      values.forEach((value, idx) => {
        expect(items[idx].textContent).to.equal(value);
      });
    }

    beforeEach(() => {
      comboBox.selectedItemsOnTop = true;
    });

    describe('items', () => {
      beforeEach(() => {
        comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
        comboBox.selectedItems = ['lemon', 'orange'];
      });

      it('should show selected items at the top of the overlay', () => {
        comboBox.opened = true;
        expectItems(['lemon', 'orange', 'apple', 'banana']);
      });

      it('should only show selected items when readonly is true', () => {
        comboBox.readonly = true;
        comboBox.opened = true;
        expectItems(['lemon', 'orange']);
      });

      it('should update dropdown items after overlay is re-opened', () => {
        comboBox.opened = true;
        getFirstItem(comboBox).click();
        expectItems(['lemon', 'orange', 'apple', 'banana']);
        comboBox.opened = false;
        comboBox.opened = true;
        expectItems(['orange', 'apple', 'banana', 'lemon']);
      });

      it('should update dropdown items after clearing and re-opening', () => {
        comboBox.clearButtonVisible = true;
        comboBox.opened = true;
        comboBox.$.clearButton.click();
        expectItems(['lemon', 'orange', 'apple', 'banana']);
        comboBox.opened = false;
        comboBox.opened = true;
        expectItems(['apple', 'banana', 'lemon', 'orange']);
      });

      it('should not show selected items on top when internal filtering applied', async () => {
        comboBox.opened = true;
        comboBox.inputElement.focus();
        await sendKeys({ type: 'a' });
        expectItems(['apple', 'banana', 'orange']);
      });

      it('should restore items when selectedItemsOnTop is set to false', () => {
        comboBox.opened = true;
        expectItems(['lemon', 'orange', 'apple', 'banana']);
        comboBox.opened = false;
        comboBox.selectedItemsOnTop = false;
        comboBox.opened = true;
        expectItems(['apple', 'banana', 'lemon', 'orange']);
      });
    });

    describe('dataProvider', () => {
      beforeEach(() => {
        comboBox.dataProvider = getDataProvider(['apple', 'banana', 'lemon', 'orange']);
        comboBox.selectedItems = ['lemon', 'orange'];
      });

      it('should show selected items at the top of the overlay', () => {
        comboBox.opened = true;
        expectItems(['lemon', 'orange', 'apple', 'banana']);
      });

      it('should only show selected items when readonly is true', () => {
        comboBox.readonly = true;
        comboBox.opened = true;
        expectItems(['lemon', 'orange']);
      });

      it('should update dropdown items after overlay is re-opened', () => {
        comboBox.opened = true;
        getFirstItem(comboBox).click();
        expectItems(['lemon', 'orange', 'apple', 'banana']);
        comboBox.opened = false;
        comboBox.opened = true;
        expectItems(['orange', 'apple', 'banana', 'lemon']);
      });

      it('should update dropdown items after clearing and re-opening', () => {
        comboBox.clearButtonVisible = true;
        comboBox.opened = true;
        comboBox.$.clearButton.click();
        expectItems(['lemon', 'orange', 'apple', 'banana']);
        comboBox.opened = false;
        comboBox.opened = true;
        expectItems(['apple', 'banana', 'lemon', 'orange']);
      });

      it('should not show selected items on top when internal filtering applied', async () => {
        comboBox.opened = true;
        comboBox.inputElement.focus();
        await sendKeys({ type: 'a' });
        expectItems(['apple', 'banana', 'orange']);
      });

      it('should restore items when selectedItemsOnTop is set to false', () => {
        comboBox.opened = true;
        expectItems(['lemon', 'orange', 'apple', 'banana']);
        comboBox.opened = false;
        comboBox.selectedItemsOnTop = false;
        comboBox.opened = true;
        expectItems(['apple', 'banana', 'lemon', 'orange']);
      });
    });

    describe('lazy loading', () => {
      let allItems;

      beforeEach(() => {
        allItems = Array.from({ length: 100 }, (_, i) => `item ${i}`);
        comboBox.dataProvider = getDataProvider(allItems);
        comboBox.selectedItemsOnTop = true;
        comboBox.opened = true;
      });

      it('should show selected item on top when its page is not loaded yet', async () => {
        comboBox.inputElement.focus();
        await sendKeys({ type: '55' });

        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Enter' });

        comboBox.opened = false;
        comboBox.opened = true;

        const item = getFirstItem(comboBox);
        expect(item.label).to.equal('item 55');
        expect(item.hasAttribute('selected')).to.be.true;
      });

      it('should not show selected item on top when filter is applied', async () => {
        comboBox.inputElement.focus();
        await sendKeys({ type: '55' });

        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Enter' });

        comboBox.opened = false;
        comboBox.opened = true;

        await sendKeys({ type: '5' });

        const item = getFirstItem(comboBox);
        expect(item.label).to.equal('item 5');
        expect(item.hasAttribute('selected')).to.be.false;
      });
    });
  });
});
