import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { getAllItems, getDataProvider, getFocusedItemIndex, getSelectAllButton, setInputValue } from './helpers.js';

describe('select all', () => {
  let comboBox, inputElement, button;

  const getSelectAllText = () => getSelectAllButton(comboBox).shadowRoot.textContent.trim();

  const clickButton = () => getSelectAllButton(comboBox).click();

  beforeEach(async () => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
    comboBox.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
    await nextRender();
    inputElement = comboBox.inputElement;
  });

  describe('basic', () => {
    beforeEach(() => {
      comboBox.opened = true;
    });

    it('should not render button by default', () => {
      expect(getSelectAllButton(comboBox)).to.be.null;
    });

    it('should toggle button when the property changes', () => {
      comboBox.selectAllButtonVisible = true;
      expect(getSelectAllButton(comboBox)).to.be.ok;

      comboBox.selectAllButtonVisible = false;
      expect(getSelectAllButton(comboBox)).to.be.null;
    });

    it('should render the button with the button role and without tabindex', () => {
      comboBox.selectAllButtonVisible = true;
      button = getSelectAllButton(comboBox);
      expect(button.getAttribute('role')).to.equal('button');
      expect(button.hasAttribute('tabindex')).to.be.false;
    });

    it('should not render button when readonly', () => {
      // Keep the overlay open in readonly mode, which only lists selected items
      comboBox.selectedItems = ['Apple'];
      comboBox.selectAllButtonVisible = true;
      comboBox.readonly = true;
      expect(comboBox.$.overlay.opened).to.be.true;
      expect(getSelectAllButton(comboBox)).to.be.null;

      comboBox.readonly = false;
      expect(getSelectAllButton(comboBox)).to.be.ok;
    });

    it('should not render button when using a data provider', async () => {
      const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`);
      comboBox = fixtureSync(
        `<vaadin-multi-select-combo-box select-all-button-visible></vaadin-multi-select-combo-box>`,
      );
      comboBox.pageSize = 10;
      comboBox.dataProvider = getDataProvider(items);
      await nextRender();
      comboBox.opened = true;

      expect(getSelectAllButton(comboBox)).to.be.null;
    });
  });

  describe('label', () => {
    beforeEach(() => {
      comboBox.selectAllButtonVisible = true;
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

    it('should update the label when the button becomes visible', () => {
      comboBox.selectAllButtonVisible = false;
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      comboBox.selectAllButtonVisible = true;
      expect(getSelectAllText()).to.equal('Deselect All');
    });

    it('should update the label when the button becomes visible after readonly', () => {
      comboBox.readonly = true;
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      comboBox.readonly = false;
      expect(getSelectAllText()).to.equal('Deselect All');
    });

    it('should compute the label from filtered items when selected items are on top', () => {
      comboBox.selectedItemsOnTop = true;
      comboBox.selectedItems = ['Pear'];
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
    beforeEach(async () => {
      comboBox.selectAllButtonVisible = true;
      inputElement.focus();
      comboBox.opened = true;
      await nextRender();
      button = getSelectAllButton(comboBox);
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should highlight the button on first ArrowDown', async () => {
      await sendKeys({ press: 'ArrowDown' });
      expect(button.hasAttribute('focused')).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should highlight the first item on second ArrowDown', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });
      expect(button.hasAttribute('focused')).to.be.false;
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should highlight the button on ArrowUp from the first item', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowUp' });
      expect(button.hasAttribute('focused')).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should highlight the last item on ArrowUp when nothing is highlighted', async () => {
      await sendKeys({ press: 'ArrowUp' });
      expect(button.hasAttribute('focused')).to.be.false;
      expect(getFocusedItemIndex(comboBox)).to.equal(3);
    });

    it('should keep the button highlighted on ArrowUp', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowUp' });
      expect(button.hasAttribute('focused')).to.be.true;
      expect(getFocusedItemIndex(comboBox)).to.equal(-1);
    });

    it('should set aria-activedescendant to the button while it is highlighted', async () => {
      await sendKeys({ press: 'ArrowDown' });
      expect(button.id).to.be.ok;
      expect(inputElement.getAttribute('aria-activedescendant')).to.equal(button.id);

      await sendKeys({ press: 'ArrowDown' });
      expect(inputElement.getAttribute('aria-activedescendant')).to.equal(getAllItems(comboBox)[0].id);

      await sendKeys({ press: 'ArrowUp' });
      expect(inputElement.getAttribute('aria-activedescendant')).to.equal(button.id);
    });

    it('should restore the filter to the input when highlighting the button', async () => {
      await sendKeys({ type: 'an' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });
      expect(inputElement.value).to.equal('Banana');

      await sendKeys({ press: 'ArrowUp' });
      expect(inputElement.value).to.equal('an');
      expect(comboBox.filter).to.equal('an');
    });

    it('should select all items on Enter', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['Apple', 'Banana', 'Lemon', 'Orange']);
      expect(getSelectAllText()).to.equal('Deselect All');
    });

    it('should deselect all items on Enter', async () => {
      comboBox.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should select filtered items on Enter', async () => {
      await sendKeys({ type: 'an' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['Banana', 'Orange']);
      expect(comboBox.filter).to.equal('an');
    });

    it('should keep the button highlighted and the overlay opened on Enter', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });
      expect(button.hasAttribute('focused')).to.be.true;
      expect(comboBox.opened).to.be.true;
      expect(getDeepActiveElement()).to.equal(inputElement);
    });

    it('should close the overlay on Escape', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Escape' });
      expect(comboBox.opened).to.be.false;
      expect(getDeepActiveElement()).to.equal(inputElement);
    });

    it('should clear the highlight when the overlay is closed', async () => {
      await sendKeys({ press: 'ArrowDown' });
      comboBox.close();
      await nextRender();
      expect(button.hasAttribute('focused')).to.be.false;
      expect(inputElement.hasAttribute('aria-activedescendant')).to.be.false;
    });

    it('should clear the highlight when the overlay is closed on outside click', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendMouse({ type: 'click', position: [400, 400] });
      await nextRender();
      expect(comboBox.opened).to.be.false;
      expect(button.hasAttribute('focused')).to.be.false;
      expect(inputElement.hasAttribute('aria-activedescendant')).to.be.false;
    });

    it('should clear the highlight when the button is hidden', async () => {
      await sendKeys({ press: 'ArrowDown' });
      comboBox.selectAllButtonVisible = false;
      await nextRender();
      expect(inputElement.hasAttribute('aria-activedescendant')).to.be.false;
      expect(comboBox.opened).to.be.true;

      comboBox.selectAllButtonVisible = true;
      await nextRender();
      expect(getSelectAllButton(comboBox).hasAttribute('focused')).to.be.false;
    });

    it('should clear the highlight when the filter changes', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ type: 'an' });
      expect(button.hasAttribute('focused')).to.be.false;
      expect(inputElement.hasAttribute('aria-activedescendant')).to.be.false;
    });

    it('should not highlight the button when it is not visible', async () => {
      comboBox.selectAllButtonVisible = false;
      await nextRender();
      await sendKeys({ press: 'ArrowDown' });
      expect(getFocusedItemIndex(comboBox)).to.equal(0);
    });

    it('should not highlight the button when readonly', async () => {
      comboBox.readonly = true;
      comboBox.selectedItems = ['Apple'];
      await nextRender();
      await sendKeys({ press: 'ArrowDown' });
      expect(inputElement.hasAttribute('aria-activedescendant')).to.be.false;
    });

    it('should not highlight the button when the filter matches no items', async () => {
      await sendKeys({ type: 'xyz' });
      await nextRender();
      expect(comboBox.$.overlay.opened).to.be.false;

      await sendKeys({ press: 'ArrowDown' });
      expect(button.hasAttribute('focused')).to.be.false;
      expect(inputElement.hasAttribute('aria-activedescendant')).to.be.false;
    });
  });

  describe('pointer', () => {
    beforeEach(async () => {
      comboBox.selectAllButtonVisible = true;
      inputElement.focus();
      await sendKeys({ press: 'ArrowDown' });
      await nextRender();
      button = getSelectAllButton(comboBox);
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
