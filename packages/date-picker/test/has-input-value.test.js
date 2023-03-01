import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { waitForScrollToFinish } from './helpers.js';

describe('has-input-value-changed event', () => {
  let datePicker, clearButton, hasInputValueChangedSpy, valueChangedSpy;

  beforeEach(async () => {
    hasInputValueChangedSpy = sinon.spy();
    valueChangedSpy = sinon.spy();
    datePicker = fixtureSync('<vaadin-date-picker clear-button-visible></vaadin-date-picker>');
    clearButton = datePicker.shadowRoot.querySelector('[part=clear-button]');
    datePicker.addEventListener('has-input-value-changed', hasInputValueChangedSpy);
    datePicker.addEventListener('value-changed', valueChangedSpy);
    datePicker.inputElement.focus();
  });

  describe('without value', () => {
    describe('with user input', () => {
      beforeEach(async () => {
        await sendKeys({ type: '1/1/2022' });
        await waitForScrollToFinish(datePicker._overlayContent);
        hasInputValueChangedSpy.resetHistory();
      });

      it('should fire the event when clearing the user input with Esc', async () => {
        await sendKeys({ press: 'Escape' });
        expect(datePicker.inputElement.value).to.be.empty;
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;
      });

      it('should fire the event when comitting the user input with Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expect(valueChangedSpy.calledOnce).to.be.true;
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        expect(hasInputValueChangedSpy.calledBefore(valueChangedSpy)).to.be.true;
      });

      it('should fire the event when selecting a date with Space', async () => {
        // Move focus inside the dropdown to the typed date.
        await sendKeys({ press: 'ArrowDown' });
        await waitForScrollToFinish(datePicker._overlayContent);
        // Select that date.
        await sendKeys({ press: 'Space' });
        expect(valueChangedSpy.calledOnce).to.be.true;
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        expect(hasInputValueChangedSpy.calledBefore(valueChangedSpy)).to.be.true;
      });
    });
  });

  describe('with value', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1/1/2022' });
      await sendKeys({ press: 'Enter' });
      valueChangedSpy.resetHistory();
      hasInputValueChangedSpy.resetHistory();
    });

    describe('with user input', () => {
      beforeEach(async () => {
        await sendKeys({ type: 'foo' });
        hasInputValueChangedSpy.resetHistory();
      });

      it('should fire the event on clear button click', () => {
        clearButton.click();
        expect(datePicker.inputElement.value).to.be.empty;
        expect(valueChangedSpy.calledOnce).to.be.true;
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        expect(hasInputValueChangedSpy.calledBefore(valueChangedSpy)).to.be.true;
      });

      it('should fire the event when reverting the user input to the value with Esc', async () => {
        await sendKeys({ press: 'Escape' });
        expect(datePicker.inputElement.value).to.equal('1/1/2022');
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;
      });
    });
  });
});
