import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-time-picker.js';

describe('events', () => {
  let timePicker;

  describe('has-input-value-changed event', () => {
    let clearButton, hasInputValueChangedSpy, valueChangedSpy;

    beforeEach(() => {
      hasInputValueChangedSpy = sinon.spy();
      valueChangedSpy = sinon.spy();
      timePicker = fixtureSync('<vaadin-time-picker clear-button-visible></vaadin-time-picker>');
      clearButton = timePicker.shadowRoot.querySelector('[part=clear-button]');
      timePicker.addEventListener('has-input-value-changed', hasInputValueChangedSpy);
      timePicker.addEventListener('value-changed', valueChangedSpy);
      timePicker.inputElement.focus();
    });

    describe('without value', () => {
      it('should be fired when entering user input', async () => {
        await sendKeys({ type: '12:00' });
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;
      });

      describe('with user input', () => {
        beforeEach(async () => {
          await sendKeys({ type: '12:00' });
          hasInputValueChangedSpy.resetHistory();
        });

        it('should be fired when clearing the user input with Esc', async () => {
          // Clear selection in the dropdown.
          await sendKeys({ press: 'Escape' });
          // Clear the user input.
          await sendKeys({ press: 'Escape' });
          expect(timePicker.inputElement.value).to.be.empty;
          expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        });
      });

      describe('with bad user input', () => {
        beforeEach(async () => {
          await sendKeys({ type: 'foo' });
          hasInputValueChangedSpy.resetHistory();
        });

        it('should be fired when clearing bad user input with Esc', async () => {
          await sendKeys({ press: 'Escape' });
          expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        });

        it('should be fired when clearing committed bad user input with Esc', async () => {
          await sendKeys({ press: 'Enter' });
          hasInputValueChangedSpy.resetHistory();
          await sendKeys({ press: 'Escape' });
          expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        });
      });
    });

    describe('with value', () => {
      beforeEach(async () => {
        await sendKeys({ type: '10:00' });
        await sendKeys({ press: 'Enter' });
        valueChangedSpy.resetHistory();
        hasInputValueChangedSpy.resetHistory();
      });

      it('should be fired on clear button click', () => {
        clearButton.click();
        expect(timePicker.inputElement.value).to.be.empty;
        expect(valueChangedSpy.calledOnce).to.be.true;
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        expect(hasInputValueChangedSpy.calledBefore(valueChangedSpy)).to.be.true;
      });

      it('should be fired when clearing the value with Esc', async () => {
        await sendKeys({ press: 'Escape' });
        expect(timePicker.inputElement.value).to.be.empty;
        expect(valueChangedSpy.calledOnce).to.be.true;
        expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        expect(hasInputValueChangedSpy.calledBefore(valueChangedSpy)).to.be.true;
      });
    });
  });
});
