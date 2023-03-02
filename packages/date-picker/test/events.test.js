import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-date-picker.js';
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

    it('should not be fired on focused date change', async () => {
      await sendKeys({ type: '1/2/2000' });
      await waitForScrollToFinish(datePicker._overlayContent);
      expect(changeSpy.called).to.be.false;
    });

    it('should be fired when committing user input with Enter', async () => {
      await sendKeys({ type: '1/2/2000' });
      await waitForScrollToFinish(datePicker._overlayContent);
      await sendKeys({ press: 'Enter' });
      expect(changeSpy.called).to.be.true;
    });

    it('should be fired after the value-changed event', async () => {
      const valueChangedSpy = sinon.spy();
      datePicker.addEventListener('value-changed', valueChangedSpy);

      await sendKeys({ type: '1/2/2000' });
      await waitForScrollToFinish(datePicker._overlayContent);
      await sendKeys({ press: 'Enter' });

      expect(valueChangedSpy.calledOnce).to.be.true;
      expect(changeSpy.calledAfter(valueChangedSpy)).to.be.true;
    });

    it('should be fired when selecting a date with Enter', async () => {
      // Open the calendar.
      await open(datePicker);

      // Move focus to the calendar
      await sendKeys({ press: 'ArrowDown' });
      await waitForScrollToFinish(datePicker._overlayContent);

      await sendKeys({ press: 'Enter' });
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should be fired when selecting a date with Space', async () => {
      // Open the calendar.
      await open(datePicker);

      // Move focus to the calendar
      await sendKeys({ press: 'ArrowDown' });
      await waitForScrollToFinish(datePicker._overlayContent);

      await sendKeys({ press: 'Space' });
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should be fired on clear button click', () => {
      datePicker.clearButtonVisible = true;
      datePicker.value = '2000-01-01';
      datePicker.$.clearButton.click();
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should not be fired on programmatic value change', () => {
      datePicker.value = '2000-01-01';
      expect(changeSpy.called).to.be.false;
    });

    it('should not be fired on programmatic value change when opened', async () => {
      await open(datePicker);
      datePicker.value = '2000-01-01';
      await close(datePicker);
      expect(changeSpy.called).to.be.false;
    });

    it('should not be fired on programmatic value change when having user input', async () => {
      await sendKeys({ type: '1/2/2000' });
      await waitForScrollToFinish(datePicker._overlayContent);
      datePicker.value = '2000-01-01';
      await close(datePicker);
      expect(changeSpy.called).to.be.false;
    });

    it('should not be fired on Enter if the value has not changed', async () => {
      datePicker.value = '2000-01-01';
      await open(datePicker);
      await sendKeys({ press: 'Enter' });
      expect(changeSpy.called).to.be.false;
    });

    it('should not be fired when reverting the user input with Escape', async () => {
      await sendKeys({ type: '1/2/2000' });
      await waitForScrollToFinish(datePicker._overlayContent);
      await sendKeys({ press: 'Escape' });
      expect(changeSpy.called).to.be.false;
    });
  });
});
