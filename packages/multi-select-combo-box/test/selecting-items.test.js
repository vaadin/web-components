import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';

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
  });
});
