import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-multi-select-combo-box.js';
import { getAllItems, getAsyncDataProvider, getFirstItem } from './helpers.js';

describe('readonly', () => {
  let comboBox, inputElement;

  describe('basic', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(
        `<div>
          <vaadin-multi-select-combo-box readonly></vaadin-multi-select-combo-box>
          <input id="last-global-focusable" />
        </div>`,
      ).firstElementChild;
      comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
      comboBox.selectedItems = ['apple', 'orange'];
      await nextRender();
      inputElement = comboBox.inputElement;
      inputElement.focus();
    });

    it('should open the dropdown on input click when readonly', () => {
      inputElement.click();
      expect(comboBox.opened).to.be.true;
    });

    it('should open the dropdown on Arrow Down when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      expect(comboBox.opened).to.be.true;
    });

    it('should open the dropdown on Arrow Up when readonly', async () => {
      await sendKeys({ down: 'ArrowUp' });
      expect(comboBox.opened).to.be.true;
    });

    it('should close the dropdown on Tab when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Tab' });
      expect(comboBox.opened).to.be.false;
    });

    it('should close the dropdown on Enter when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.opened).to.be.false;
    });

    it('should close the dropdown on Esc when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Escape' });
      expect(comboBox.opened).to.be.false;
    });

    it('should not clear on Esc when readonly and clear button visible', async () => {
      comboBox.clearButtonVisible = true;
      await sendKeys({ press: 'Escape' });
      expect(comboBox.selectedItems).to.eql(['apple', 'orange']);
    });

    it('should not pre-fill focused item label on Arrow Down', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      expect(inputElement.value).to.equal('');
    });

    it('should not pre-fill focused item label on Arrow Up', async () => {
      await sendKeys({ down: 'ArrowUp' });
      await sendKeys({ down: 'ArrowUp' });
      expect(inputElement.value).to.equal('');
    });

    it('should not set item focus-ring attribute on Arrow Down', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      const item = getFirstItem(comboBox);
      expect(item.hasAttribute('focus-ring')).to.be.false;
    });

    it('should not set item focus-ring attribute on Arrow Up', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      const items = getAllItems(comboBox);
      expect(items[1].hasAttribute('focus-ring')).to.be.false;
    });

    it('should only render selected items in the dropdown when readonly', () => {
      inputElement.click();
      const items = getAllItems(comboBox);
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('orange');
    });

    it('should render regular items in the dropdown when readonly is off', () => {
      comboBox.readonly = false;
      inputElement.click();
      const items = getAllItems(comboBox);
      expect(items.length).to.equal(4);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('banana');
      expect(items[2].textContent).to.equal('lemon');
      expect(items[3].textContent).to.equal('orange');
    });

    it('should render selected items updated while readonly', () => {
      comboBox.selectedItems = [];
      comboBox.selectedItems = ['lemon'];
      inputElement.click();
      const items = getAllItems(comboBox);
      expect(items.length).to.equal(1);
      expect(items[0].textContent).to.equal('lemon');
    });

    it('should not set selected attribute on the dropdown items', () => {
      inputElement.click();
      const items = getAllItems(comboBox);
      expect(items[0].hasAttribute('selected')).to.be.false;
      expect(items[1].hasAttribute('selected')).to.be.false;
    });

    it('should set readonly attribute on the dropdown items', () => {
      inputElement.click();
      const items = getAllItems(comboBox);
      expect(items[0].hasAttribute('readonly')).to.be.true;
      expect(items[1].hasAttribute('readonly')).to.be.true;
    });

    it('should not un-select item on click when readonly', () => {
      inputElement.click();
      const item = getFirstItem(comboBox);
      item.click();
      expect(comboBox.selectedItems.length).to.equal(2);
    });

    it('should not open the dropdown if selected items are empty', () => {
      comboBox.selectedItems = [];
      inputElement.click();
      expect(comboBox.opened).to.be.false;
    });

    it('should not open the dropdown if readonly is set after clearing', () => {
      comboBox.readonly = false;
      comboBox.selectedItems = [];

      comboBox.readonly = true;
      inputElement.click();
      expect(comboBox.opened).to.be.false;
    });
  });

  describe('dataProvider', () => {
    let asyncDataProviderSpy;

    const asyncDataProvider = getAsyncDataProvider(['apple', 'banana', 'lemon', 'orange']);

    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box readonly></vaadin-multi-select-combo-box>`);
      asyncDataProviderSpy = sinon.spy(asyncDataProvider);
      comboBox.dataProvider = asyncDataProviderSpy;
      comboBox.selectedItems = ['apple', 'orange'];
      await nextRender();
      inputElement = comboBox.inputElement;
      inputElement.focus();
    });

    it('should not fetch items from the data-provider when readonly', async () => {
      inputElement.click();
      // Wait for the async data provider timeout
      await aTimeout(0);
      expect(asyncDataProviderSpy.called).to.be.false;
    });

    it('should only render selected items in the dropdown when readonly', async () => {
      inputElement.click();
      // Wait for the async data provider timeout
      await aTimeout(0);
      const items = getAllItems(comboBox);
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('orange');
    });

    it('should render regular items in the dropdown when readonly is off', async () => {
      comboBox.readonly = false;
      inputElement.click();
      // Wait for the async data provider timeout
      await aTimeout(0);
      const items = getAllItems(comboBox);
      expect(items.length).to.equal(4);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('banana');
      expect(items[2].textContent).to.equal('lemon');
      expect(items[3].textContent).to.equal('orange');
    });

    it('should render selected items in the dropdown when size is set', async () => {
      inputElement.click();
      // Wait for the async data provider timeout
      await aTimeout(0);
      comboBox.size = 4;
      const items = getAllItems(comboBox);
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('orange');
    });
  });

  describe('dataProvider is set after selectedItems', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box readonly></vaadin-multi-select-combo-box>`);
      comboBox.selectedItems = ['apple', 'orange'];
      comboBox.dataProvider = getAsyncDataProvider(['apple', 'banana', 'lemon', 'orange']);
      await nextRender();
      inputElement = comboBox.inputElement;
    });

    it('should only render selected items in the dropdown when readonly', async () => {
      inputElement.click();
      // Wait for the async data provider timeout
      await aTimeout(0);
      const items = getAllItems(comboBox);
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('orange');
    });
  });

  describe('dataProvider is changed while readonly', () => {
    const asyncDataProvider1 = getAsyncDataProvider(['item 1', 'item 2']);
    const asyncDataProvider2 = getAsyncDataProvider(['new item 1', 'new item 2']);

    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
      comboBox.dataProvider = asyncDataProvider1;
      await nextRender();
      // Load the first page.
      comboBox.inputElement.click();
      comboBox.readonly = true;
      comboBox.dataProvider = asyncDataProvider2;
    });

    it('should render the new items when readonly is off', async () => {
      comboBox.readonly = false;
      comboBox.inputElement.click();
      // Wait for the async data provider timeout
      await aTimeout(0);
      const items = getAllItems(comboBox);
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('new item 1');
      expect(items[1].textContent).to.equal('new item 2');
    });
  });

  describe('external filtering', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
      comboBox.filteredItems = ['apple', 'banana', 'lemon', 'orange'];
      comboBox.selectedItems = ['apple', 'orange'];
      comboBox.readonly = true;
      await nextRender();
      inputElement = comboBox.inputElement;
      inputElement.focus();
    });

    it('should only render selected items in the dropdown when readonly', () => {
      inputElement.click();
      const items = getAllItems(comboBox);
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('orange');
    });

    it('should render regular items in the dropdown when readonly is off', () => {
      comboBox.readonly = false;
      inputElement.click();
      const items = getAllItems(comboBox);
      expect(items.length).to.equal(4);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('banana');
      expect(items[2].textContent).to.equal('lemon');
      expect(items[3].textContent).to.equal('orange');
    });
  });
});
