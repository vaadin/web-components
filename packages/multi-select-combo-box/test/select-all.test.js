import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { getAllItems, getDataProvider, getFocusedItemIndex, getSelectAllButton, setInputValue } from './helpers.js';

describe('select all', () => {
  let comboBox, inputElement, button;

  const getSelectAllText = () => getSelectAllButton(comboBox).textContent.trim();

  const clickButton = () => getSelectAllButton(comboBox).click();

  beforeEach(async () => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
    comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
    await nextRender();
    inputElement = comboBox.inputElement;
  });

  describe('enabling', () => {
    beforeEach(() => {
      button = getSelectAllButton(comboBox);
      comboBox.opened = true;
    });

    it('should hide button by default', () => {
      expect(button.hasAttribute('hidden')).to.be.true;
    });

    it('should toggle button hidden attribute when the property changes', () => {
      comboBox.selectAllButtonVisible = true;
      expect(button.hasAttribute('hidden')).to.be.false;

      comboBox.selectAllButtonVisible = false;
      expect(button.hasAttribute('hidden')).to.be.true;
    });

    it('should hide button when readonly', () => {
      // Keep the overlay open in readonly mode, which only lists selected items
      comboBox.selectedItems = ['Apple'];
      comboBox.selectAllButtonVisible = true;
      comboBox.readonly = true;
      expect(comboBox.$.overlay.opened).to.be.true;
      expect(button.hasAttribute('hidden')).to.be.true;

      comboBox.readonly = false;
      expect(button.hasAttribute('hidden')).to.be.false;
    });

    it('should hide button when using a data provider', async () => {
      const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`);
      comboBox = fixtureSync(
        `<vaadin-multi-select-combo-box select-all-button-visible></vaadin-multi-select-combo-box>`,
      );
      button = getSelectAllButton(comboBox);
      comboBox.selectAllButtonVisible = true;
      comboBox.pageSize = 10;
      comboBox.dataProvider = getDataProvider(items);
      await nextRender();
      comboBox.opened = true;

      expect(button.hasAttribute('hidden')).to.be.true;
    });
  });

  describe('label', () => {
    beforeEach(() => {
      comboBox.selectAllButtonVisible = true;
      button = getSelectAllButton(comboBox);
    });

    it('should use selectAll label when nothing is selected', () => {
      expect(getSelectAllText()).to.equal('Select All');
    });

    it('should use selectAll label when some items are selected', () => {
      comboBox.selectedItems = ['Apple'];
      expect(getSelectAllText()).to.equal('Select All');
    });

    it('should use deselectAll label when all items are selected', () => {
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      expect(getSelectAllText()).to.equal('Deselect All');
    });

    it('should use selectFiltered label when a filter is set', () => {
      setInputValue(comboBox, 'an');
      expect(getSelectAllText()).to.equal('Select Filtered');
    });

    it('should use selectFiltered label when some filtered items are selected', () => {
      comboBox.selectedItems = ['Banana'];
      setInputValue(comboBox, 'an');
      expect(getSelectAllText()).to.equal('Select Filtered');
    });

    it('should use deselectFiltered label when all filtered items are selected', () => {
      comboBox.selectedItems = ['Banana', 'Orange'];
      setInputValue(comboBox, 'an');
      expect(getSelectAllText()).to.equal('Deselect Filtered');
    });

    it('should update the label when the filter is cleared', () => {
      comboBox.selectedItems = ['Banana', 'Orange'];
      setInputValue(comboBox, 'an');
      setInputValue(comboBox, '');
      expect(getSelectAllText()).to.equal('Select All');
    });

    it('should ignore unknown values when computing the label', () => {
      comboBox.allowCustomValue = true;
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange', 'Custom'];
      expect(getSelectAllText()).to.equal('Deselect All');
    });

    it('should compute the label from filtered items when selected items are on top', () => {
      comboBox.selectedItemsOnTop = true;
      comboBox.selectedItems = ['Pear'];
      comboBox.opened = true;
      expect(getSelectAllText()).to.equal('Select All');
    });

    it('should use custom i18n labels', () => {
      comboBox.i18n = {
        selectAll: 'Alle auswählen',
        deselectAll: 'Auswahl aufheben',
        selectFiltered: 'Gefilterte auswählen',
        deselectFiltered: 'Gefilterte abwählen',
      };
      expect(getSelectAllText()).to.equal('Alle auswählen');

      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      expect(getSelectAllText()).to.equal('Auswahl aufheben');

      setInputValue(comboBox, 'an');
      expect(getSelectAllText()).to.equal('Gefilterte abwählen');

      comboBox.selectedItems = [];
      expect(getSelectAllText()).to.equal('Gefilterte auswählen');
    });

    describe('object items', () => {
      const apple = { id: 1, name: 'Apple' };
      const banana = { id: 2, name: 'Banana' };
      const lemon = { id: 3, name: 'Lemon' };

      beforeEach(() => {
        comboBox.itemIdPath = 'id';
        comboBox.itemLabelPath = 'name';
        comboBox.items = [apple, banana, lemon];
      });

      it('should use deselectAll label when all items are selected by id', () => {
        comboBox.selectedItems = [{ ...apple }, { ...banana }, { ...lemon }];
        expect(getSelectAllText()).to.equal('Deselect All');
      });

      it('should use selectAll label when some items are selected by id', () => {
        comboBox.selectedItems = [{ ...apple }];
        expect(getSelectAllText()).to.equal('Select All');
      });
    });
  });

  describe('clicking', () => {
    let changeSpy, selectedItemsChangedSpy;

    beforeEach(() => {
      comboBox.selectAllButtonVisible = true;
      button = getSelectAllButton(comboBox);
      changeSpy = sinon.spy();
      comboBox.addEventListener('change', changeSpy);
      selectedItemsChangedSpy = sinon.spy();
      comboBox.addEventListener('selected-items-changed', selectedItemsChangedSpy);
      comboBox.opened = true;
    });

    it('should select all items', () => {
      comboBox.selectedItems = [];
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Apple', 'Banana', 'Lemon', 'Orange']);
    });

    it('should deselect all items', () => {
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should select all items when some items are selected', () => {
      comboBox.selectedItems = ['Apple'];
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Apple', 'Banana', 'Lemon', 'Orange']);
    });

    it('should select all items keeping the order of already selected items', () => {
      comboBox.selectedItems = ['Lemon'];
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Lemon', 'Apple', 'Banana', 'Orange']);
    });

    it('should select only filtered items', () => {
      comboBox.selectedItems = ['Lemon'];
      setInputValue(comboBox, 'an');
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Lemon', 'Banana', 'Orange']);
    });

    it('should deselect only filtered items', () => {
      comboBox.selectedItems = ['Lemon', 'Banana', 'Orange'];
      setInputValue(comboBox, 'an');
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Lemon']);
    });

    it('should keep the filter after clicking', () => {
      setInputValue(comboBox, 'an');
      clickButton();
      expect(comboBox.filter).to.equal('an');
      expect(inputElement.value).to.equal('an');
    });

    it('should preserve unknown values when selecting all items', () => {
      comboBox.allowCustomValue = true;
      comboBox.selectedItems = ['Custom'];
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Custom', 'Apple', 'Banana', 'Lemon', 'Orange']);
    });

    it('should preserve unknown values when deselecting all items', () => {
      comboBox.allowCustomValue = true;
      comboBox.selectedItems = ['Custom', 'Apple', 'Banana', 'Lemon', 'Orange'];
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Custom']);
    });

    it('should select all items when selected items are on top', () => {
      comboBox.selectedItemsOnTop = true;
      comboBox.selectedItems = ['Pear'];
      clickButton();
      expect(comboBox.selectedItems).to.deep.equal(['Pear', 'Apple', 'Banana', 'Lemon', 'Orange']);
    });

    it('should update the label after selecting all items', () => {
      clickButton();
      expect(getSelectAllText()).to.equal('Deselect All');
    });

    it('should update the label after deselecting all items', () => {
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      clickButton();
      expect(getSelectAllText()).to.equal('Select All');
    });

    it('should fire change event once when selecting all items', () => {
      clickButton();
      expect(changeSpy).to.be.calledOnce;
    });

    it('should fire change event once when deselecting all items', () => {
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      clickButton();
      expect(changeSpy).to.be.calledOnce;
    });

    it('should fire selected-items-changed event when selecting all items', () => {
      clickButton();
      expect(selectedItemsChangedSpy).to.be.calledOnce;
      expect(selectedItemsChangedSpy.firstCall.args[0].detail.value).to.deep.equal([
        'Apple',
        'Banana',
        'Lemon',
        'Orange',
      ]);
    });

    it('should update selected state of the dropdown items', () => {
      clickButton();
      getAllItems(comboBox).forEach((item) => {
        expect(item.hasAttribute('selected')).to.be.true;
      });

      clickButton();
      getAllItems(comboBox).forEach((item) => {
        expect(item.hasAttribute('selected')).to.be.false;
      });
    });

    it('should keep the overlay opened', () => {
      clickButton();
      expect(comboBox.opened).to.be.true;

      clickButton();
      expect(comboBox.opened).to.be.true;
    });

    it('should validate when selecting all items', () => {
      const validatedSpy = sinon.spy();
      comboBox.addEventListener('validated', validatedSpy);
      clickButton();
      expect(validatedSpy).to.be.calledOnce;
    });

    it('should mark required field as invalid when deselecting all items', () => {
      comboBox.required = true;
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      clickButton();
      expect(comboBox.invalid).to.be.true;
    });

    describe('object items', () => {
      const apple = { id: 1, name: 'Apple' };
      const banana = { id: 2, name: 'Banana' };
      const lemon = { id: 3, name: 'Lemon' };

      beforeEach(() => {
        comboBox.itemIdPath = 'id';
        comboBox.itemLabelPath = 'name';
        comboBox.items = [apple, banana, lemon];
      });

      it('should select all items by id', () => {
        comboBox.selectedItems = [{ ...banana }];
        clickButton();
        expect(comboBox.selectedItems).to.deep.equal([banana, apple, lemon]);
      });

      it('should deselect all items by id', () => {
        comboBox.selectedItems = [{ ...apple }, { ...banana }, { ...lemon }];
        clickButton();
        expect(comboBox.selectedItems).to.deep.equal([]);
      });
    });
  });

  describe('keyboard', () => {
    beforeEach(() => {
      comboBox.selectAllButtonVisible = true;
      comboBox.opened = true;
      button = getSelectAllButton(comboBox);
      button.focus();
    });

    it('should select all items on Space', async () => {
      await sendKeys({ press: 'Space' });
      expect(comboBox.selectedItems).to.deep.equal(['Apple', 'Banana', 'Lemon', 'Orange']);
      expect(getSelectAllText()).to.equal('Deselect All');
    });

    it('should select all items on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['Apple', 'Banana', 'Lemon', 'Orange']);
      expect(getSelectAllText()).to.equal('Deselect All');
    });

    it('should not submit the surrounding form', () => {
      expect(getSelectAllButton(comboBox).getAttribute('type')).to.equal('button');
    });
  });

  describe('focus handling', () => {
    let lastGlobalFocusable;

    beforeEach(() => {
      comboBox.selectAllButtonVisible = true;
      button = getSelectAllButton(comboBox);
      lastGlobalFocusable = fixtureSync('<input id="last-global-focusable" />');
      inputElement.focus();
      comboBox.opened = true;
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should trap focus between input and button', async () => {
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(button);

      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(inputElement);

      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(button);

      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(inputElement);
    });

    it('should keep the overlay opened when switching between input and button', async () => {
      await sendKeys({ press: 'Tab' });
      expect(comboBox.opened).to.be.true;
      expect(comboBox.$.overlay.opened).to.be.true;

      await sendKeys({ press: 'Tab' });
      expect(comboBox.opened).to.be.true;
      expect(comboBox.$.overlay.opened).to.be.true;
    });

    it('should update focus attribute when switching between input and button', async () => {
      expect(comboBox.hasAttribute('focused')).to.be.true;
      expect(comboBox.hasAttribute('focus-ring')).to.be.true;

      await sendKeys({ press: 'Tab' });
      expect(comboBox.hasAttribute('focused')).to.be.true;
      expect(comboBox.hasAttribute('focus-ring')).to.be.false;

      await sendKeys({ press: 'Tab' });
      expect(comboBox.hasAttribute('focused')).to.be.true;
      expect(comboBox.hasAttribute('focus-ring')).to.be.true;
    });

    it('should reset the focused item when focusing button', async () => {
      await sendKeys({ press: 'ArrowDown' });
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
      expect(inputElement.hasAttribute('aria-activedescendant')).to.be.true;

      await sendKeys({ press: 'Tab' });
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
      expect(inputElement.hasAttribute('aria-activedescendant')).to.be.false;
    });

    it('should restore the filter to the input when focusing button', async () => {
      await sendKeys({ type: 'an' });
      await sendKeys({ press: 'ArrowDown' });
      expect(inputElement.value).to.equal('Banana');

      await sendKeys({ press: 'Tab' });
      expect(inputElement.value).to.equal('an');
      expect(comboBox.filter).to.equal('an');
    });

    it('should not trap focus in the component when the button is not visible', async () => {
      comboBox.selectAllButtonVisible = false;

      await sendKeys({ press: 'Tab' });
      expect(comboBox.opened).to.be.false;
      expect(getDeepActiveElement()).to.equal(lastGlobalFocusable);
    });

    it('should not focus the button on Tab when the overlay is closed', async () => {
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(lastGlobalFocusable);
    });

    it('should not focus the button on Tab when readonly', async () => {
      comboBox.readonly = true;
      comboBox.selectedItems = ['Apple'];
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(lastGlobalFocusable);
    });

    it('should keep the button focused after selecting all items', async () => {
      button.focus();
      await sendKeys({ press: 'Space' });
      expect(getDeepActiveElement()).to.equal(button);
      expect(comboBox.opened).to.be.true;
    });

    it('should close the overlay and focus the input on Escape', async () => {
      button.focus();
      await sendKeys({ press: 'Escape' });
      expect(comboBox.opened).to.be.false;
      expect(getDeepActiveElement()).to.equal(inputElement);
    });

    it('should focus the input and the first item on ArrowDown', async () => {
      button.focus();
      await sendKeys({ press: 'ArrowDown' });
      expect(getDeepActiveElement()).to.equal(inputElement);
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should focus the input and the last item on ArrowUp', async () => {
      button.focus();
      await sendKeys({ press: 'ArrowUp' });
      expect(getDeepActiveElement()).to.equal(inputElement);
      expect(getFocusedItemIndex(comboBox)).to.equal(3);
    });

    it('should focus the input when the overlay is closed', () => {
      button.focus();
      comboBox.close();
      expect(getDeepActiveElement()).to.equal(inputElement);
    });

    it('should focus the input when the overlay is closed on outside click', async () => {
      button.focus();
      await sendMouse({ type: 'click', position: [400, 400] });
      expect(comboBox.opened).to.be.false;
      expect(getDeepActiveElement()).to.equal(inputElement);
    });

    it('should focus the input when the button is removed', () => {
      button.focus();
      comboBox.selectAllButtonVisible = false;
      expect(getDeepActiveElement()).to.equal(inputElement);
      expect(comboBox.opened).to.be.true;
    });
  });

  describe('pointer', () => {
    beforeEach(async () => {
      comboBox.selectAllButtonVisible = true;
      button = getSelectAllButton(comboBox);
      inputElement.focus();
      await sendKeys({ press: 'ArrowDown' });
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should select all items on click without moving focus', async () => {
      await sendMouseToElement({ type: 'click', element: button });
      expect(comboBox.selectedItems).to.deep.equal(['Apple', 'Banana', 'Lemon', 'Orange']);
      expect(getDeepActiveElement()).to.equal(inputElement);
      expect(comboBox.opened).to.be.true;
    });
  });
});
