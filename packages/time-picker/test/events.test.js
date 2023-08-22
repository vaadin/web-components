import { expect } from '@esm-bundle/chai';
import { arrowDown, arrowUp, enter, esc, fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-time-picker.js';

describe('events', () => {
  let timePicker;

  describe('change event', () => {
    let changeSpy, inputElement;

    beforeEach(() => {
      timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
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

    it('should be fired after value-changed event on arrow keys', () => {
      timePicker.step = 0.5;
      const valueChangedSpy = sinon.spy();
      timePicker.addEventListener('value-changed', valueChangedSpy);
      arrowDown(inputElement);
      expect(valueChangedSpy.calledOnce).to.be.true;
      expect(changeSpy.calledOnce).to.be.true;
      expect(valueChangedSpy.calledBefore(changeSpy)).to.be.true;
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

    it('should not be fired again on Enter if the value has not changed', async () => {
      inputElement.focus();
      await sendKeys({ type: '10:00' });
      await sendKeys({ press: 'Enter' });
      expect(changeSpy).to.be.calledOnce;

      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Enter' });
      expect(changeSpy).to.be.calledOnce;
    });

    it('should not be fired again on blur if the value has not changed', async () => {
      timePicker.step = 0.5;
      inputElement.focus();

      await sendKeys({ press: 'ArrowDown' });
      expect(changeSpy).to.be.calledOnce;

      inputElement.blur();
      expect(changeSpy).to.be.calledOnce;
    });
  });

  describe('has-input-value-changed event', () => {
    let clearButton, hasInputValueChangedSpy, valueChangedSpy;

    beforeEach(async () => {
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

      describe('with bad user input', async () => {
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
