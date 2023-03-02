import { expect } from '@esm-bundle/chai';
import { arrowDown, arrowUp, enter, esc, fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-time-picker.js';

describe('events', () => {
  let timePicker, comboBox;

  describe('change event', () => {
    let changeSpy, inputElement;

    beforeEach(() => {
      timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
      comboBox = timePicker.$.comboBox;
      inputElement = timePicker.inputElement;
      changeSpy = sinon.spy();
      timePicker.addEventListener('change', changeSpy);
    });

    it('should be fired when committing user input with Enter', async () => {
      inputElement.focus();
      await sendKeys({ type: '00:00' });
      await sendKeys({ press: 'Enter' });
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should be fired when selecting a time with arrows and committing with Enter', () => {
      arrowDown(inputElement);
      arrowDown(inputElement);
      enter(inputElement);
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should be fired on clear button click', () => {
      timePicker.clearButtonVisible = true;
      timePicker.value = '00:00';
      timePicker.$.clearButton.click();
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should be fired on arrow keys when no dropdown opens', () => {
      timePicker.step = 0.5;
      arrowDown(inputElement);
      expect(changeSpy.calledOnce).to.be.true;
      arrowUp(inputElement);
      expect(changeSpy.calledTwice).to.be.true;
    });

    it('should not be fired on focused time change', async () => {
      inputElement.focus();
      await sendKeys({ type: '00:00' });
      expect(changeSpy.called).to.be.false;
    });

    it('should not be fired on programmatic value change', () => {
      timePicker.value = '01:00';
      expect(changeSpy.called).to.be.false;
    });

    it('should not be fired on programmatic value change after manual one', () => {
      timePicker.value = '00:00';
      timePicker.open();
      inputElement.value = '';
      arrowDown(inputElement);
      enter(inputElement);
      expect(changeSpy.calledOnce).to.be.true;
      // Mimic native change happening on text-field blur
      document.body.click();
      timePicker.value = '02:00';
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should not be fired on Enter if the value has not changed', () => {
      timePicker.value = '01:00';
      timePicker.open();
      enter(inputElement);
      expect(changeSpy.called).to.be.false;
    });

    it('should not be fired on revert', () => {
      timePicker.open();
      timePicker.value = '01:00';
      esc(inputElement);
      esc(inputElement);
      expect(changeSpy.called).to.be.false;
    });

    it('should be fired only once', async () => {
      timePicker.focus();
      timePicker.open();
      await sendKeys({ type: '0' });
      enter(inputElement);
      inputElement.blur();
      expect(changeSpy.callCount).to.equal(1);
    });
  });
});
