import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';

const TODAY_DATE = new Date().toISOString().split('T')[0];

describe('value commit - autoOpenDisabled', () => {
  let datePicker, valueChangedSpy, validateSpy, changeSpy, unparsableChangeSpy;

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
    expect(unparsableChangeSpy).to.be.not.called;
    expect(changeSpy).to.be.calledOnce;
    expect(changeSpy.firstCall).to.be.calledAfter(validateSpy.firstCall);
    expect(datePicker.value).to.equal(value);
  }

  function expectUnparsableValueCommit() {
    expect(valueChangedSpy).to.be.not.called;
    // TODO: Optimize the number of validation runs.
    expect(validateSpy).to.be.called;
    expect(changeSpy).to.be.not.called;
    expect(unparsableChangeSpy).to.be.calledOnce;
    expect(unparsableChangeSpy).to.be.calledAfter(validateSpy);
  }

  function expectValidationOnly() {
    expect(valueChangedSpy).to.be.not.called;
    // TODO: Optimize the number of validation runs.
    expect(validateSpy).to.be.called;
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

    unparsableChangeSpy = sinon.spy().named('unparsableChangeSpy');
    datePicker.addEventListener('unparsable-change', unparsableChangeSpy);

    datePicker.focus();
  });

  describe('default', () => {
    it('should not commit but validate on blur', () => {
      datePicker.blur();
      expectValidationOnly();
    });

    it('should not commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectNoValueCommit();
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

  describe('parsable input entered', () => {
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

  describe('parsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1/1/2001' });
      await sendKeys({ press: 'Enter' });
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
      changeSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit on blur', () => {
        datePicker.blur();
        expectValueCommit('');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
      });

      it('should commit on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectValueCommit('');
      });
    });
  });

  describe('unparsable input entered', () => {
    beforeEach(async () => {
      await sendKeys({ type: 'foo' });
    });

    it('should commit as unparsable value change on blur', () => {
      datePicker.blur();
      expectUnparsableValueCommit();
      expect(datePicker.inputElement.value).to.equal('foo');
    });

    it('should commit as unparsable value change on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectUnparsableValueCommit();
      expect(datePicker.inputElement.value).to.equal('foo');
    });

    it('should commit as unparsable value change on outside click', () => {
      outsideClick();
      expectUnparsableValueCommit();
      expect(datePicker.inputElement.value).to.equal('foo');
    });

    it('should revert on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
      expect(datePicker.inputElement.value).to.equal('');
    });
  });

  describe('unparsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: 'foo' });
      await sendKeys({ press: 'Enter' });
      validateSpy.resetHistory();
      unparsableChangeSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit as unparsable value change on blur', () => {
        datePicker.blur();
        expectUnparsableValueCommit();
      });

      it('should commit as unparsable value change on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectUnparsableValueCommit();
      });

      it('should commit as unparsable value change on outside click', () => {
        outsideClick();
        expectUnparsableValueCommit();
      });

      it('should clear and commit as unparsable value change on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectUnparsableValueCommit();
        expect(datePicker.inputElement.value).to.equal('');
      });
    });

    describe('unparsable input changed', () => {
      beforeEach(async () => {
        await sendKeys({ type: 'bar' });
      });

      it('should commit as unparsable value change on blur', () => {
        datePicker.blur();
        expectUnparsableValueCommit();
      });

      it('should commit as unparsable value change on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectUnparsableValueCommit();
      });

      it('should commit as unparsable value change on outside click', () => {
        outsideClick();
        expectUnparsableValueCommit();
      });
    });
  });

  describe('value set programmatically', () => {
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

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectNoValueCommit();
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

    describe('parsable input entered', () => {
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

    describe('unparsable input entered', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ type: 'foo' });
      });

      it('should commit an empty value on blur', () => {
        datePicker.blur();
        expectValueCommit('');
        expect(datePicker.inputElement.value).to.equal('foo');
      });

      it('should commit an empty value on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
        expect(datePicker.inputElement.value).to.equal('foo');
      });

      it('should commit an empty value on outside click', () => {
        outsideClick();
        expectValueCommit('');
        expect(datePicker.inputElement.value).to.equal('foo');
      });

      it('should revert on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });
  });
});
