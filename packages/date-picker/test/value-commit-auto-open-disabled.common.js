import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

const TODAY_DATE = new Date().toISOString().split('T')[0];

describe('value commit - autoOpenDisabled', () => {
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
    datePicker = fixtureSync(`<vaadin-date-picker auto-open-disabled></vaadin-date-picker>`);
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

    it('should not commit but validate on outside click', () => {
      outsideClick();
      expectValidationOnly();
    });

    it('should not commit on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
    });
  });

  describe('entering parsable input', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1/1/2001' });
    });

    it('should commit on blur', () => {
      datePicker.blur();
      expectValueCommit('2001-01-01');
    });

    it('should commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValueCommit('2001-01-01');
    });

    it('should commit on outside click', () => {
      outsideClick();
      expectValueCommit('2001-01-01');
    });

    it('should revert on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
      expect(datePicker.inputElement.value).to.equal('');
    });
  });

  describe('entering unparsable input', () => {
    beforeEach(async () => {
      await sendKeys({ type: 'foobar' });
    });

    it('should not commit but validate on blur', () => {
      datePicker.blur();
      expectValidationOnly();
      expect(datePicker.inputElement.value).to.equal('foobar');
    });

    it('should not commit but validate on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValidationOnly();
      expect(datePicker.inputElement.value).to.equal('foobar');
    });

    it('should not commit but validate on outside click', () => {
      outsideClick();
      expectValidationOnly();
      expect(datePicker.inputElement.value).to.equal('foobar');
    });

    it('should revert on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
      expect(datePicker.inputElement.value).to.equal('');
    });

    describe('clearing input with Backspace', () => {
      beforeEach(async () => {
        await sendKeys({ press: 'Enter' });
        valueChangedSpy.resetHistory();
        validateSpy.resetHistory();

        datePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should not commit but validate on blur', () => {
        datePicker.blur();
        expectValidationOnly();
      });

      it('should not commit but validate on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValidationOnly();
      });

      it('should not commit but validate on outside click', () => {
        outsideClick();
        expectValidationOnly();
      });
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

      it('should not commit but validate on outside click', () => {
        outsideClick();
        expectValidationOnly();
      });
    });

    describe('entering parsable input', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ type: '1/1/2001' });
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('2001-01-01');
      });

      it('should commit on outside click', () => {
        outsideClick();
        expectValueCommit('2001-01-01');
      });

      it('should revert on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('entering unparsable input', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ type: 'foobar' });
      });

      it('should commit an empty value on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
        expect(datePicker.value).to.equal('');
        expect(datePicker.inputElement.value).to.equal('foobar');
      });

      it('should commit an empty value on outside click', () => {
        outsideClick();
        expectValueCommit('');
        expect(datePicker.value).to.equal('');
        expect(datePicker.inputElement.value).to.equal('foobar');
      });

      it('should revert on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('clearing input with Backspace', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit on blur', () => {
        datePicker.blur();
        expectValueCommit('');
        expect(datePicker.value).to.equal('');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
        expect(datePicker.value).to.equal('');
      });

      it('should commit on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectValueCommit('');
        expect(datePicker.value).to.equal('');
      });
    });
  });
});
