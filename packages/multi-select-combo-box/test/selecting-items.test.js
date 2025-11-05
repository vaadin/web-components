import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, keyboardEventFor, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { getAllItems, getDataProvider, getFirstItem } from './helpers.js';

describe('selecting items', () => {
  let comboBox, inputElement;

  function expectItems(values) {
    const items = getAllItems(comboBox);
    expect(items.length).to.equal(values.length);
    values.forEach((value, idx) => {
      expect(items[idx].textContent).to.equal(value);
    });
  }

  beforeEach(async () => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
    await nextRender();
    inputElement = comboBox.inputElement;
    inputElement.focus();
  });

  describe('basic', () => {
    beforeEach(() => {
      comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should update selectedItems when selecting an item on Enter', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should update selectedItems on Enter when auto open is disabled', async () => {
      comboBox.autoOpenDisabled = true;
      await sendKeys({ type: 'apple' });
      await sendKeys({ press: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should update selectedItems when selecting an item on click', async () => {
      await sendKeys({ down: 'ArrowDown' });
      const item = getFirstItem(comboBox);
      item.click();
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should unselect item on click when it was selected on Enter', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'apple' });
      await sendKeys({ down: 'Enter' });
      getFirstItem(comboBox).click();
      expect(comboBox.selectedItems).to.deep.equal([]);
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

    it('should clear input element value when selecting an item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'apple' });
      await sendKeys({ down: 'Enter' });
      expect(inputElement.value).to.equal('');
    });

    it('should keep overlay open when selecting an item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.opened).to.be.true;
    });

    it('should keep overlay focused index when selecting an item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      const item = getFirstItem(comboBox);
      expect(item.hasAttribute('focused')).to.be.true;
    });

    it('should keep overlay focused index when entering and committing', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ type: 'banana' });
      await sendKeys({ down: 'Enter' });
      const item = getAllItems(comboBox)[1];
      expect(item.hasAttribute('focused')).to.be.true;
    });

    it('should not unselect previously committed item on focusout', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      await sendKeys({ down: 'Tab' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should not unselect previously committed item on outside click', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      await sendMouse({ type: 'click', position: [200, 200] });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should not unselect previously committed item on blur after outside click with allow custom value', async () => {
      comboBox.allowCustomValue = true;
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      await sendMouse({ type: 'click', position: [200, 200] });
      await sendKeys({ down: 'Tab' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });

    it('should not set previously committed item to input on blur with allow custom value', async () => {
      comboBox.allowCustomValue = true;
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      await sendKeys({ down: 'Tab' });
      expect(comboBox.filter).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should not select an item on outside click when it is focused', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendMouse({ type: 'click', position: [200, 200] });
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should reset the item focused state when closing on outside click', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });

      await sendMouse({ type: 'click', position: [400, 400] });

      await sendKeys({ press: 'ArrowDown' });
      await oneEvent(comboBox._overlayElement, 'vaadin-overlay-open');

      const item = getFirstItem(comboBox);
      expect(item.hasAttribute('focused')).to.be.false;
    });

    it('should reset the item focused state when closing on blur', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });

      // Blur the combo-box
      await sendKeys({ press: 'Shift+Tab' });

      // Focus and re-open
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'ArrowDown' });
      const item = getFirstItem(comboBox);
      expect(item.hasAttribute('focused')).to.be.false;
    });

    it('should not select an item on blur when it is focused', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Tab' });
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should un-select item when using clear() method', () => {
      comboBox.selectedItems = ['orange'];
      comboBox.clear();
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should keep the filter and input value when committing an invalid option', async () => {
      await sendKeys({ type: 'an' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.opened).to.be.true;
      expect(comboBox.filter).to.equal('an');
      expect(inputElement.value).to.equal('an');
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

  describe('enter key propagation', () => {
    const verifyEnterKeyPropagation = (allowPropagation) => {
      const enterEvent = keyboardEventFor('keydown', 13, [], 'Enter');
      const stopPropagationSpy = sinon.spy(enterEvent, 'stopPropagation');
      inputElement.dispatchEvent(enterEvent);
      expect(stopPropagationSpy.called).to.equal(!allowPropagation);
    };

    beforeEach(() => {
      comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
    });

    it('should stop propagation of the keyboard Enter event when dropdown is opened', async () => {
      await sendKeys({ press: 'ArrowDown' });
      verifyEnterKeyPropagation(false);
    });

    it('should stop propagation of the keyboard Enter event when input value is invalid', async () => {
      await sendKeys({ type: 'lime' });
      verifyEnterKeyPropagation(false);
    });

    it('should stop propagation of the keyboard Enter event when input is invalid and not opened', async () => {
      comboBox.autoOpenDisabled = true;
      await sendKeys({ type: 'lime' });
      verifyEnterKeyPropagation(false);
    });
  });

  describe('selected items on top', () => {
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

      it('should not include ghost items in the dropdown', async () => {
        comboBox.opened = true;
        await nextRender();

        // Remove an item from the combo-box while keeping it open
        comboBox.items = ['apple', 'banana', 'lemon'];
        comboBox.selectedItems = ['lemon'];
        await nextRender();

        expectItems(['lemon', 'apple', 'banana']);
      });
    });

    describe('object items', () => {
      const items = [
        { id: '0', label: 'apple' },
        { id: '1', label: 'banana' },
        { id: '2', label: 'lemon' },
        { id: '3', label: 'orange' },
        { id: '4', label: 'pear' },
      ];

      beforeEach(() => {
        comboBox.itemIdPath = 'id';
        comboBox.items = items;
      });

      it('should show selected items at the top of the overlay', () => {
        comboBox.selectedItems = items.slice(1, 3);
        comboBox.opened = true;
        expectItems(['banana', 'lemon', 'apple', 'orange', 'pear']);
      });

      it('should synchronize selected item state when overlay is opened', async () => {
        comboBox.selectedItems = [{ id: '1', label: 'banana' }];
        comboBox.opened = true;
        const itemReference = getFirstItem(comboBox).item;
        comboBox.selectedItems = [{ id: '1', label: 'banana' }];
        await nextRender();
        expect(getFirstItem(comboBox).item).to.not.equal(itemReference);
      });

      it('should not change order while synchronizing selected items', async () => {
        comboBox.selectedItems = [
          { id: '1', label: 'banana' },
          { id: '4', label: 'pear' },
        ];
        comboBox.opened = true;
        comboBox.selectedItems = [{ id: '1', label: 'banana' }];
        await nextRender();
        expectItems(['banana', 'pear', 'apple', 'lemon', 'orange']);
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

  describe('keep filter', () => {
    beforeEach(() => {
      comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
      comboBox.keepFilter = true;
    });

    it('should keep the filter after selecting items', async () => {
      await sendKeys({ type: 'an' });
      expectItems(['banana', 'orange']);

      const filterChangeSpy = sinon.spy();
      comboBox.addEventListener('filter-changed', filterChangeSpy);

      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['banana']);
      expect(comboBox.filter).to.equal('an');
      expect(inputElement.value).to.equal('an');
      expectItems(['banana', 'orange']);
      // Filter should never change, otherwise data provider would be called
      expect(filterChangeSpy.notCalled).to.be.true;
    });

    it('should clear the filter when closing the overlay', async () => {
      await sendKeys({ type: 'an' });
      expectItems(['banana', 'orange']);

      inputElement.blur();
      expect(comboBox.filter).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should clear a matching filter when closing the overlay', async () => {
      await sendKeys({ type: 'apple' });

      inputElement.blur();
      expect(comboBox.selectedItems).to.deep.equal([]);
      expect(comboBox.filter).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should clear the filter when pressing escape', async () => {
      await sendKeys({ type: 'an' });
      expectItems(['banana', 'orange']);

      await sendKeys({ down: 'Escape' });
      expect(comboBox.filter).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should clear the filter when pressing escape with autoOpenDisabled', async () => {
      comboBox.autoOpenDisabled = true;
      await sendKeys({ type: 'an' });
      expect(comboBox.filter).to.equal('an');

      await sendKeys({ down: 'Escape' });
      expect(comboBox.filter).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should clear the filter when pressing escape after selecting an item', async () => {
      await sendKeys({ type: 'an' });
      expectItems(['banana', 'orange']);

      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      // Pressing escape twice to first deselect item and then close the overlay
      await sendKeys({ down: 'Escape' });
      await sendKeys({ down: 'Escape' });
      expect(comboBox.opened).to.be.false;
      expect(comboBox.filter).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should keep the filter and input value when committing an invalid option', async () => {
      await sendKeys({ type: 'an' });
      expectItems(['banana', 'orange']);

      await sendKeys({ down: 'Enter' });
      expect(comboBox.opened).to.be.true;
      expect(inputElement.value).to.equal('an');
      expect(comboBox.filter).to.equal('an');
    });

    it('should allow toggling items via keyboard', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);

      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should restore the input value to the filter after selecting an item', async () => {
      await sendKeys({ type: 'an' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['banana']);
      expect(inputElement.value).to.equal('an');
    });

    describe('with allowCustomValue', () => {
      beforeEach(() => {
        comboBox.allowCustomValue = true;
      });

      it('should clear the filter value after entering custom value', async () => {
        await sendKeys({ type: 'pear' });
        await sendKeys({ down: 'Enter' });
        expect(comboBox.filter).to.equal('');
        expect(inputElement.value).to.equal('');
      });
    });
  });
});
