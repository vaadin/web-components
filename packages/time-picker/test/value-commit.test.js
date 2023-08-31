import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-time-picker.js';
import { getAllItems } from './helpers.js';

describe('value commit', () => {
  let timePicker, valueChangedSpy, validateSpy, changeSpy;

  function expectNoValueCommit() {
    expect(valueChangedSpy).to.be.not.called;
    expect(validateSpy).to.be.not.called;
    expect(changeSpy).to.be.not.called;
  }

  function expectValueCommit(value) {
    expect(valueChangedSpy).to.be.calledOnce;
    expect(validateSpy).to.be.calledOnce;
    expect(validateSpy.firstCall).to.be.calledAfter(valueChangedSpy.firstCall);
    expect(changeSpy).to.be.calledOnce;
    expect(changeSpy.firstCall).to.be.calledAfter(validateSpy.firstCall);
    expect(timePicker.value).to.equal(value);
  }

  function expectValidationOnly() {
    expect(valueChangedSpy).to.be.not.called;
    expect(validateSpy).to.be.calledOnce;
    expect(changeSpy).to.be.not.called;
  }

  beforeEach(async () => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    await nextRender();
    validateSpy = sinon.spy(timePicker, 'validate').named('validateSpy');

    valueChangedSpy = sinon.spy().named('valueChangedSpy');
    timePicker.addEventListener('value-changed', valueChangedSpy);

    changeSpy = sinon.spy().named('changeSpy');
    timePicker.addEventListener('change', changeSpy);

    timePicker.focus();
  });

  describe('default', () => {
    it('should not commit but validate on blur', () => {
      timePicker.blur();
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

    it('should not commit but validate on close with outside click', () => {
      timePicker.click();
      outsideClick();
      expectValidationOnly();
    });

    it('should not commit but validate on close with Escape', async () => {
      timePicker.click();
      await sendKeys({ press: 'Escape' });
      expectValidationOnly();
    });

    it('should not commit on ArrowDown', async () => {
      // Open the dropdown
      await sendKeys({ press: 'ArrowDown' });
      // Focus an item
      await sendKeys({ press: 'ArrowDown' });
      expectNoValueCommit();
    });

    it('should not commit on ArrowUp', async () => {
      // Open the dropdown
      await sendKeys({ press: 'ArrowUp' });
      // Focus an item
      await sendKeys({ press: 'ArrowUp' });
      expectNoValueCommit();
    });
  });

  describe('entering parsable input', () => {
    beforeEach(async () => {
      await sendKeys({ type: '12:00' });
    });

    it('should not commit by default', () => {
      expectNoValueCommit();
    });

    it('should commit on blur', () => {
      timePicker.blur();
      expectValueCommit('12:00');
    });

    it('should commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValueCommit('12:00');
    });

    it('should commit on close with outside click', () => {
      outsideClick();
      expectValueCommit('12:00');
    });

    it('should revert and validate on close with Escape', async () => {
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Escape' });
      expectValidationOnly();
      expect(timePicker.inputElement.value).to.equal('');
    });
  });

  describe('entering unparsable input', () => {
    beforeEach(async () => {
      await sendKeys({ type: 'INVALID' });
    });

    it('should not commit by default', () => {
      expectNoValueCommit();
    });

    it('should not commit but validate on blur', () => {
      timePicker.blur();
      expectValidationOnly();
      expect(timePicker.inputElement.value).to.equal('INVALID');
    });

    it('should not commit but validate on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValidationOnly();
      expect(timePicker.inputElement.value).to.equal('INVALID');
    });

    it('should not commit but validate on close with outside click', () => {
      outsideClick();
      expectValidationOnly();
      expect(timePicker.inputElement.value).to.equal('INVALID');
    });

    it('should revert and validate on close with Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectValidationOnly();
      expect(timePicker.inputElement.value).to.equal('');
    });

    describe('clearing input with Backspace', () => {
      beforeEach(async () => {
        await sendKeys({ press: 'Enter' });
        valueChangedSpy.resetHistory();
        validateSpy.resetHistory();

        timePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should not commit but validate on blur', () => {
        timePicker.blur();
        expectValidationOnly();
      });

      it('should not commit but validate on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValidationOnly();
      });

      it('should not commit but validate on close with outside click', () => {
        outsideClick();
        expectValidationOnly();
      });

      it('should revert and validate on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectValidationOnly();
        expect(timePicker.inputElement.value).to.equal('INVALID');
      });
    });
  });

  describe('overlay', () => {
    beforeEach(async () => {
      timePicker.click();
      await sendKeys({ press: 'ArrowDown' });
    });

    it('should commit on selection with click', () => {
      getAllItems(timePicker)[0].click();
      expectValueCommit('00:00');
    });

    it('should commit on selection with Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValueCommit('00:00');
    });
  });

  describe('with value', () => {
    let initialInputElementValue;

    beforeEach(() => {
      timePicker.value = '00:00';
      initialInputElementValue = timePicker.inputElement.value;
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
    });

    describe('default', () => {
      it('should not commit but validate on blur', () => {
        timePicker.blur();
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

      it('should not commit but validate on close with outside click', () => {
        timePicker.click();
        outsideClick();
        expectValidationOnly();
      });

      it('should not commit but validate on close with Escape', async () => {
        timePicker.click();
        await sendKeys({ press: 'Escape' });
        expectValidationOnly();
      });
    });

    describe('entering parsable input', () => {
      beforeEach(async () => {
        timePicker.inputElement.select();
        await sendKeys({ type: '12:00' });
      });

      it('should commit on blur', () => {
        timePicker.blur();
        expectValueCommit('12:00');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('12:00');
      });

      it('should commit on close with outside click', () => {
        outsideClick();
        expectValueCommit('12:00');
      });

      it('should revert and validate on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        await sendKeys({ press: 'Escape' });
        expectValidationOnly();
        expect(timePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('entering unparsable input', () => {
      beforeEach(async () => {
        timePicker.inputElement.select();
        await sendKeys({ type: 'INVALID' });
      });

      it('should commit an empty value on blur', () => {
        timePicker.blur();
        expectValueCommit('');
        expect(timePicker.inputElement.value).to.equal('INVALID');
      });

      it('should commit an empty value on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
        expect(timePicker.inputElement.value).to.equal('INVALID');
      });

      it('should commit an empty value on close with outside click', () => {
        outsideClick();
        expectValueCommit('');
        expect(timePicker.inputElement.value).to.equal('INVALID');
      });

      it('should revert and validate on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectValidationOnly();
        expect(timePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('clearing input with Backspace', () => {
      beforeEach(async () => {
        timePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit on blur', () => {
        timePicker.blur();
        expectValueCommit('');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
      });

      it('should commit on outside click', () => {
        outsideClick();
        expectValueCommit('');
      });

      it('should revert and validate on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectValidationOnly();
        expect(timePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('with clear button', () => {
      beforeEach(() => {
        timePicker.clearButtonVisible = true;
      });

      it('should clear on clear button click', () => {
        timePicker.$.clearButton.click();
        expectValueCommit('');
      });

      it('should clear on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectValueCommit('');
      });
    });
  });

  describe('with step', () => {
    beforeEach(() => {
      timePicker.step = 1;
    });

    it('should commit on ArrowUp', async () => {
      await sendKeys({ press: 'ArrowUp' });
      expectValueCommit('00:00:01');
    });

    it('should commit on ArrowDown', async () => {
      await sendKeys({ press: 'ArrowDown' });
      expectValueCommit('23:59:59');
    });

    describe('with value committed using an arrow key', () => {
      beforeEach(async () => {
        await sendKeys({ press: 'ArrowDown' });
        valueChangedSpy.resetHistory();
        validateSpy.resetHistory();
        changeSpy.resetHistory();
      });

      it('should not commit but validate on blur', () => {
        timePicker.blur();
        expectValidationOnly();
      });

      it('should not commit but validate on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValidationOnly();
      });

      // TODO: Why does it validate on Escape?
      it('should not commit but validate on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectValidationOnly();
      });
    });
  });
});
