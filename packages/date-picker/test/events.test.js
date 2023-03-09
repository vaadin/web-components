import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../src/vaadin-date-picker.js';
import { close, open, waitForScrollToFinish } from './helpers.js';

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

    it('should not fire change on focused date change', async () => {
      await sendKeys({ type: '1/2/2000' });
      expect(changeSpy.called).to.be.false;
    });

    it('should fire change on user text input commit', async () => {
      await sendKeys({ type: '1/2/2000' });
      await sendKeys({ press: 'Enter' });
      expect(changeSpy.called).to.be.true;
    });

    it('should fire change after value-changed event', async () => {
      const valueChangedSpy = sinon.spy();
      datePicker.addEventListener('value-changed', valueChangedSpy);

      await sendKeys({ type: '1/2/2000' });
      await sendKeys({ press: 'Enter' });

      expect(valueChangedSpy.calledOnce).to.be.true;
      expect(changeSpy.calledAfter(valueChangedSpy)).to.be.true;
    });

    it('should fire change on selecting date with Enter', async () => {
      // Open the overlay
      await open(datePicker);

      // Move focus to the calendar
      await sendKeys({ press: 'ArrowDown' });
      await nextRender(datePicker);

      await sendKeys({ press: 'Enter' });
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should fire change on selecting date with Space', async () => {
      // Open the overlay
      await open(datePicker);

      // Move focus to the calendar
      await sendKeys({ press: 'ArrowDown' });
      await nextRender(datePicker);

      await sendKeys({ press: 'Space' });
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should fire change clear button click', () => {
      datePicker.clearButtonVisible = true;
      datePicker.value = '2000-01-01';
      datePicker.$.clearButton.click();
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should not fire change on programmatic value change', () => {
      datePicker.value = '2000-01-01';
      expect(changeSpy.called).to.be.false;
    });

    it('should not fire change on programmatic value change when opened', async () => {
      await open(datePicker);
      datePicker.value = '2000-01-01';
      await close(datePicker);
      expect(changeSpy.called).to.be.false;
    });

    it('should not fire change on programmatic value change when text input changed', async () => {
      await sendKeys({ type: '1/2/2000' });
      datePicker.value = '2000-01-01';
      await close(datePicker);
      expect(changeSpy.called).to.be.false;
    });

    it('should not fire change if the value was not changed', async () => {
      datePicker.value = '2000-01-01';
      await open(datePicker);
      await sendKeys({ press: 'Enter' });
      expect(changeSpy.called).to.be.false;
    });

    it('should not fire change when reverting input with Escape', async () => {
      await sendKeys({ type: '1/2/2000' });
      await sendKeys({ press: 'Escape' });
      expect(changeSpy.called).to.be.false;
    });
  });

  describe('has-input-value-changed event', () => {
    let clearButton, hasInputValueChangedSpy, valueChangedSpy;

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

        it('should be fired when clearing the user input with Esc', async () => {
          await sendKeys({ press: 'Escape' });
          expect(datePicker.inputElement.value).to.be.empty;
          expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        });

        it('should be fired when comitting the user input with Enter', async () => {
          await sendKeys({ press: 'Enter' });
          expect(valueChangedSpy.calledOnce).to.be.true;
          expect(hasInputValueChangedSpy.calledOnce).to.be.true;
          expect(hasInputValueChangedSpy.calledBefore(valueChangedSpy)).to.be.true;
        });

        it('should be fired when selecting a date with Space', async () => {
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

        it('should be fired on clear button click', () => {
          clearButton.click();
          expect(datePicker.inputElement.value).to.be.empty;
          expect(valueChangedSpy.calledOnce).to.be.true;
          expect(hasInputValueChangedSpy.calledOnce).to.be.true;
          expect(hasInputValueChangedSpy.calledBefore(valueChangedSpy)).to.be.true;
        });

        it('should be fired when reverting the user input to the value with Esc', async () => {
          await sendKeys({ press: 'Escape' });
          expect(datePicker.inputElement.value).to.equal('1/1/2022');
          expect(hasInputValueChangedSpy.calledOnce).to.be.true;
        });
      });
    });
  });
});
