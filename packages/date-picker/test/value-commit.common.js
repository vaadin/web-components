import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, outsideClick, tap } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { waitForOverlayRender } from './helpers.js';

const TODAY_DATE = new Date().toISOString().split('T')[0];

describe('value commit', () => {
  let datePicker, valueChangedSpy, validateSpy, changeSpy;

  function expectNoValueCommit() {
    expect(valueChangedSpy).to.be.not.called;
    expect(validateSpy).to.be.not.called;
    expect(changeSpy).to.be.not.called;
  }

  function expectValueCommit(value) {
    expect(valueChangedSpy).to.be.calledOnce;
    // TODO: Optimize the number of validation runs.
    expect(validateSpy).to.be.called;
    expect(validateSpy.firstCall).to.be.calledAfter(valueChangedSpy.firstCall);
    expect(changeSpy).to.be.calledOnce;
    expect(changeSpy.firstCall).to.be.calledAfter(validateSpy.firstCall);
    expect(datePicker.value).to.equal(value);
  }

  function expectValidationOnly() {
    expect(valueChangedSpy).to.be.not.called;
    expect(validateSpy).to.be.calledOnce;
    expect(changeSpy).to.be.not.called;
  }

  beforeEach(async () => {
    datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
    await nextRender();
    validateSpy = sinon.spy(datePicker, 'validate').named('validateSpy');

    valueChangedSpy = sinon.spy().named('valueChangedSpy');
    datePicker.addEventListener('value-changed', valueChangedSpy);

    changeSpy = sinon.spy().named('changeSpy');
    datePicker.addEventListener('change', changeSpy);

    datePicker.focus();
  });

  describe('default', () => {
    it('should not commit but validate on blur', () => {
      datePicker.blur();
      expectValidationOnly();
    });

    it('should not commit but validate on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValidationOnly();
    });

    it('should not commit on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
    });

    it('should not commit but validate on close with outside click', async () => {
      datePicker.click();
      await waitForOverlayRender();
      outsideClick();
      expectValidationOnly();
    });

    it('should not commit on close with Escape', async () => {
      datePicker.click();
      await waitForOverlayRender();
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
    });
  });

  describe('entering parsable input', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1/1/2001' });
      await waitForOverlayRender();
    });

    it('should commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValueCommit('2001-01-01');
    });

    it('should commit on close with outside click', () => {
      outsideClick();
      expectValueCommit('2001-01-01');
    });

    it('should revert on close with Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
      expect(datePicker.inputElement.value).to.equal('');
    });
  });

  describe('entering unparsable input', () => {
    beforeEach(async () => {
      await sendKeys({ type: 'INVALID' });
      await waitForOverlayRender();
    });

    it('should not commit but validate on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValidationOnly();
      expect(datePicker.inputElement.value).to.equal('INVALID');
    });

    it('should not commit but validate on close with outside click', async () => {
      outsideClick();
      expectValidationOnly();
      expect(datePicker.inputElement.value).to.equal('INVALID');
    });

    it('should revert on close with Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
      expect(datePicker.inputElement.value).to.equal('');
    });

    describe('clearing input with Backspace', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should not commit but validate on Enter after clearing', async () => {
        await sendKeys({ press: 'Enter' });
        expectValidationOnly();
      });

      it('should not commit but validate on outside click after clearing', async () => {
        outsideClick();
        expectValidationOnly();
      });
    });
  });

  describe('overlay', () => {
    beforeEach(async () => {
      await sendKeys({ press: 'ArrowDown' });
      await waitForOverlayRender();
    });

    it('should commit on selection with click', () => {
      const date = getDeepActiveElement();
      tap(date);
      expectValueCommit(TODAY_DATE);
    });

    it('should commit on selection with Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValueCommit(TODAY_DATE);
    });

    it('should commit on selection with Space', async () => {
      await sendKeys({ press: 'Space' });
      expectValueCommit(TODAY_DATE);
    });
  });

  describe('with value', () => {
    let initialInputElementValue;

    beforeEach(() => {
      datePicker.value = TODAY_DATE;
      initialInputElementValue = datePicker.inputElement.value;
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
    });

    describe('default', () => {
      it('should not commit but validate on blur', () => {
        datePicker.blur();
        expectValidationOnly();
      });

      it('should not commit but validate on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValidationOnly();
      });

      it('should not commit on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
      });

      it('should not commit on close with outside click', async () => {
        datePicker.click();
        await waitForOverlayRender();
        outsideClick();
        expectNoValueCommit();
      });

      it('should not commit on close with Escape', async () => {
        datePicker.click();
        await waitForOverlayRender();
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
      });
    });

    describe('entering parsable input', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ type: '1/1/2001' });
        await waitForOverlayRender();
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('2001-01-01');
      });

      it('should commit on close with outside click', () => {
        outsideClick();
        expectValueCommit('2001-01-01');
      });

      it('should revert on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('entering unparsable input', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ type: 'INVALID' });
        await waitForOverlayRender();
      });

      it('should commit an empty value on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
        expect(datePicker.inputElement.value).to.equal('INVALID');
      });

      it('should commit an empty value on close with outside click', async () => {
        outsideClick();
        expectValueCommit('');
        expect(datePicker.inputElement.value).to.equal('INVALID');
      });

      it('should commit an empty value on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectValueCommit('');
        expect(datePicker.inputElement.value).to.equal('INVALID');
      });
    });

    describe('overlay', () => {
      beforeEach(async () => {
        await sendKeys({ press: 'ArrowDown' });
        await waitForOverlayRender();
      });

      it('should commit on unselection with Space', async () => {
        await sendKeys({ press: 'Space' });
        expectValueCommit('');
      });
    });

    describe('clearing input with Backspace', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit on blur after clearing', () => {
        datePicker.blur();
        expectValueCommit('');
      });

      it('should commit on Enter after clearing', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
      });

      it('should commit on Escape after clearing', async () => {
        await sendKeys({ press: 'Escape' });
        expectValueCommit('');
      });

      it('should commit on close with Escape after clearing', async () => {
        await sendKeys({ press: 'ArrowDown' });
        await waitForOverlayRender();
        await sendKeys({ press: 'Escape' });
        expectValueCommit('');
      });
    });

    describe('with clear button', () => {
      beforeEach(() => {
        datePicker.clearButtonVisible = true;
      });

      it('should clear on clear button click', () => {
        datePicker.$.clearButton.click();
        expectValueCommit('');
      });

      it('should clear on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectValueCommit('');
      });
    });
  });
});
