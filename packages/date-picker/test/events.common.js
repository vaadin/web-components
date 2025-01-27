import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { open, waitForOverlayRender, waitForScrollToFinish } from './helpers.js';

describe('events', () => {
  let datePicker;

  describe('change event', () => {
    let changeSpy;

    beforeEach(async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      await nextRender();
      changeSpy = sinon.spy();
      datePicker.addEventListener('change', changeSpy);
      datePicker.inputElement.focus();
    });

    it('should not be fired on programmatic value change when opened', async () => {
      await open(datePicker);
      datePicker.value = '2000-01-01';
      datePicker.close();
      expect(changeSpy.called).to.be.false;
    });

    it('should not be fired on programmatic value change when having user input', async () => {
      await sendKeys({ type: '1/2/2000' });
      await waitForScrollToFinish(datePicker);
      datePicker.value = '2000-01-01';
      datePicker.close();
      expect(changeSpy.called).to.be.false;
    });
  });

  describe('has-input-value-changed event', () => {
    let clearButton, hasInputValueChangedSpy, valueChangedSpy;

    beforeEach(async () => {
      hasInputValueChangedSpy = sinon.spy();
      valueChangedSpy = sinon.spy();
      datePicker = fixtureSync('<vaadin-date-picker clear-button-visible></vaadin-date-picker>');
      await nextRender();
      clearButton = datePicker.shadowRoot.querySelector('[part=clear-button]');
      datePicker.addEventListener('has-input-value-changed', hasInputValueChangedSpy);
      datePicker.addEventListener('value-changed', valueChangedSpy);
      datePicker.inputElement.focus();
    });

    describe('without value', () => {
      describe('with user input', () => {
        beforeEach(async () => {
          await sendKeys({ type: '1/1/2022' });
          await waitForScrollToFinish(datePicker);
          hasInputValueChangedSpy.resetHistory();
        });

        it('should be fired when clearing the user input with Esc', async () => {
          await sendKeys({ press: 'Escape' });
          expect(datePicker.inputElement.value).to.be.empty;
          expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        });
      });
    });

    describe('with value', () => {
      beforeEach(async () => {
        await sendKeys({ type: '1/1/2022' });
        await waitForScrollToFinish(datePicker);
        await sendKeys({ press: 'Enter' });
        valueChangedSpy.resetHistory();
        hasInputValueChangedSpy.resetHistory();
      });

      describe('with user input', () => {
        beforeEach(async () => {
          await sendKeys({ type: 'foo' });
          await waitForOverlayRender();
          hasInputValueChangedSpy.resetHistory();
        });

        it('should be fired on clear button click', () => {
          clearButton.click();
          expect(datePicker.inputElement.value).to.be.empty;
          expect(valueChangedSpy.calledOnce).to.be.true;
          expect(hasInputValueChangedSpy.calledOnce).to.be.true;
          expect(hasInputValueChangedSpy.calledBefore(valueChangedSpy)).to.be.true;
        });
      });
    });
  });
});
