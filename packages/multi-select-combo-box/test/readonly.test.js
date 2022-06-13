import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';
import { getAsyncDataProvider } from './helpers.js';

describe('readonly', () => {
  let comboBox, inputElement, internal;

  describe('basic', () => {
    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box readonly></vaadin-multi-select-combo-box>`);
      comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
      comboBox.selectedItems = ['apple', 'orange'];
      internal = comboBox.$.comboBox;
      inputElement = comboBox.inputElement;
      inputElement.focus();
    });

    it('should open the dropdown on input click when readonly', () => {
      inputElement.click();
      expect(internal.opened).to.be.true;
    });

    it('should open the dropdown on Arrow Down when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      expect(internal.opened).to.be.true;
    });

    it('should open the dropdown on Arrow Up when readonly', async () => {
      await sendKeys({ down: 'ArrowUp' });
      expect(internal.opened).to.be.true;
    });

    it('should close the dropdown on Tab when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Tab' });
      expect(internal.opened).to.be.false;
    });

    it('should close the dropdown on Enter when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(internal.opened).to.be.false;
    });

    it('should close the dropdown on Esc when readonly', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Escape' });
      expect(internal.opened).to.be.false;
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
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items[0].hasAttribute('focus-ring')).to.be.false;
    });

    it('should not set item focus-ring attribute on Arrow Up', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items[1].hasAttribute('focus-ring')).to.be.false;
    });

    it('should only render selected items in the dropdown when readonly', () => {
      inputElement.click();
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('orange');
    });

    it('should render regular items in the dropdown when readonly is off', () => {
      comboBox.readonly = false;
      inputElement.click();
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
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
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items.length).to.equal(1);
      expect(items[0].textContent).to.equal('lemon');
    });

    it('should not set selected attribute on the dropdown items', () => {
      inputElement.click();
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items[0].hasAttribute('selected')).to.be.false;
      expect(items[1].hasAttribute('selected')).to.be.false;
    });

    it('should set readonly attribute on the dropdown items', () => {
      inputElement.click();
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items[0].hasAttribute('readonly')).to.be.true;
      expect(items[1].hasAttribute('readonly')).to.be.true;
    });

    it('should not un-select item on click when readonly', () => {
      inputElement.click();
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();
      expect(comboBox.selectedItems.length).to.equal(2);
    });

    it('should not open the dropdown if selected items are empty', () => {
      comboBox.selectedItems = [];
      inputElement.click();
      expect(internal.opened).to.be.false;
    });

    it('should not open the dropdown if readonly is set after clearing', () => {
      comboBox.readonly = false;
      comboBox.selectedItems = [];

      comboBox.readonly = true;
      inputElement.click();
      expect(internal.opened).to.be.false;
    });
  });

  describe('dataProvider', () => {
    let asyncDataProviderSpy;

    const asyncDataProvider = getAsyncDataProvider(['apple', 'banana', 'lemon', 'orange']);

    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box readonly></vaadin-multi-select-combo-box>`);
      asyncDataProviderSpy = sinon.spy(asyncDataProvider);
      comboBox.dataProvider = asyncDataProviderSpy;
      comboBox.selectedItems = ['apple', 'orange'];
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
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('orange');
    });

    it('should render regular items in the dropdown when readonly is off', async () => {
      comboBox.readonly = false;
      inputElement.click();
      // Wait for the async data provider timeout
      await aTimeout(0);
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items.length).to.equal(4);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('banana');
      expect(items[2].textContent).to.equal('lemon');
      expect(items[3].textContent).to.equal('orange');
    });
  });

  describe('external filtering', () => {
    beforeEach(() => {
      comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
      comboBox.filteredItems = ['apple', 'banana', 'lemon', 'orange'];
      comboBox.selectedItems = ['apple', 'orange'];
      comboBox.readonly = true;
      inputElement = comboBox.inputElement;
      inputElement.focus();
    });

    it('should only render selected items in the dropdown when readonly', () => {
      inputElement.click();
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('orange');
    });

    it('should render regular items in the dropdown when readonly is off', () => {
      comboBox.readonly = false;
      inputElement.click();
      const items = document.querySelectorAll('vaadin-multi-select-combo-box-item');
      expect(items.length).to.equal(4);
      expect(items[0].textContent).to.equal('apple');
      expect(items[1].textContent).to.equal('banana');
      expect(items[2].textContent).to.equal('lemon');
      expect(items[3].textContent).to.equal('orange');
    });
  });
});
