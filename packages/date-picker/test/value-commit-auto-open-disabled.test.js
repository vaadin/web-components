import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, outsideClick, tap } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { waitForOverlayRender } from './helpers.js';

const TODAY_DATE = new Date().toISOString().split('T')[0];

describe('value commit - autoOpenDisabled', () => {
  let datePicker, valueChangedSpy, validatedSpy, changeSpy;

  beforeEach(async () => {
    datePicker = fixtureSync(`<vaadin-date-picker auto-open-disabled></vaadin-date-picker>`);
    await nextRender();
    valueChangedSpy = sinon.spy().named('valueChangedSpy');
    validatedSpy = sinon.spy().named('validatedSpy');
    changeSpy = sinon.spy().named('changeSpy');
    datePicker.addEventListener('value-changed', valueChangedSpy);
    datePicker.addEventListener('validated', validatedSpy);
    datePicker.addEventListener('change', changeSpy);
    datePicker.focus();
  });

  describe('default', () => {
    it('should not commit but validate on blur', () => {
      datePicker.blur();
      expect(valueChangedSpy).to.be.not.called;
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.not.called;
    });

    it('should not commit but validate on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(valueChangedSpy).to.be.not.called;
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.not.called;
    });

    it('should not commit but validate on outside click', async () => {
      outsideClick();
      expect(valueChangedSpy).to.be.not.called;
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.not.called;
    });

    it('should not commit on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expect(valueChangedSpy).to.be.not.called;
      expect(validatedSpy).to.be.not.called;
      expect(changeSpy).to.be.not.called;
    });
  });

  describe('user input', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1/1/2001' });
    });

    it('should commit on blur', async () => {
      datePicker.blur();
      expect(valueChangedSpy).to.be.calledOnce;
      // TODO: Optimize
      expect(validatedSpy).to.be.calledTwice;
      expect(validatedSpy.firstCall).to.be.calledAfter(valueChangedSpy.firstCall);
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy.firstCall).to.be.calledAfter(validatedSpy.firstCall);
      expect(datePicker.value).to.equal('2001-01-01');
    });

    it('should commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(valueChangedSpy).to.be.calledOnce;
      expect(validatedSpy).to.be.calledOnce;
      expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledAfter(validatedSpy);
      expect(datePicker.value).to.equal('2001-01-01');
    });

    it('should commit on outside click', () => {
      outsideClick();
      expect(valueChangedSpy).to.be.calledOnce;
      // TODO: Optimize
      expect(validatedSpy).to.be.calledTwice;
      expect(validatedSpy.firstCall).to.be.calledAfter(valueChangedSpy.firstCall);
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy.firstCall).to.be.calledAfter(validatedSpy.firstCall);
      expect(datePicker.value).to.equal('2001-01-01');
    });

    it('should revert on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expect(valueChangedSpy).to.be.not.called;
      expect(validatedSpy).to.be.not.called;
      expect(changeSpy).to.be.not.called;
      expect(datePicker.inputElement.value).to.equal('');
    });
  });

  describe('bad input', () => {
    beforeEach(async () => {
      await sendKeys({ type: 'INVALID' });
    });

    it('should not commit but validate on blur', async () => {
      datePicker.blur();
      expect(valueChangedSpy).to.be.not.called;
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.not.called;
      expect(datePicker.inputElement.value).to.equal('INVALID');
    });

    it('should not commit but validate on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(valueChangedSpy).to.be.not.called;
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.not.called;
      expect(datePicker.inputElement.value).to.equal('INVALID');
    });

    it('should not commit but validate on outside click', async () => {
      outsideClick();
      expect(valueChangedSpy).to.be.not.called;
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.not.called;
      expect(datePicker.inputElement.value).to.equal('INVALID');
    });

    it('should revert on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expect(valueChangedSpy).to.be.not.called;
      expect(validatedSpy).to.be.not.called;
      expect(changeSpy).to.be.not.called;
      expect(datePicker.inputElement.value).to.equal('');
    });
  });

  describe('with value', () => {
    let initialInputElementValue;

    beforeEach(() => {
      datePicker.value = TODAY_DATE;
      initialInputElementValue = datePicker.inputElement.value;
      valueChangedSpy.resetHistory();
      validatedSpy.resetHistory();
    });

    describe('default', () => {
      it('should not commit but validate on blur', () => {
        datePicker.blur();
        expect(valueChangedSpy).to.be.not.called;
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.not.called;
      });

      it('should not commit but validate on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expect(valueChangedSpy).to.be.not.called;
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.not.called;
      });

      it('should not commit on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expect(valueChangedSpy).to.be.not.called;
        expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
      });

      it('should not commit but validate on outside click', async () => {
        outsideClick();
        expect(valueChangedSpy).to.be.not.called;
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.not.called;
      });
    });

    describe('user input', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ type: '1/1/2001' });
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expect(valueChangedSpy).to.be.calledOnce;
        expect(validatedSpy).to.be.calledOnce;
        expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('2001-01-01');
      });

      it('should commit on outside click', () => {
        outsideClick();
        expect(valueChangedSpy).to.be.calledOnce;
        // TODO: Optimize
        expect(validatedSpy).to.be.calledTwice;
        expect(validatedSpy.firstCall).to.be.calledAfter(valueChangedSpy.firstCall);
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy.firstCall).to.be.calledAfter(validatedSpy.firstCall);
        expect(datePicker.value).to.equal('2001-01-01');
      });

      it('should revert on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expect(valueChangedSpy).to.be.not.called;
        expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('bad input', () => {
      beforeEach(async () => {
        await sendKeys({ type: 'INVALID' });
      });

      it('should revert on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expect(valueChangedSpy).to.be.not.called;
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.not.called;
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });

      it('should revert on outside click', async () => {
        outsideClick();
        expect(valueChangedSpy).to.be.not.called;
        // TODO: Optimize
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.not.called;
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });

      it('should revert on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expect(valueChangedSpy).to.be.not.called;
        expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('clearing with Backspace', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit on blur after clearing', () => {
        datePicker.blur();
        expect(valueChangedSpy).to.be.calledOnce;
        // TODO: Optimize
        expect(validatedSpy).to.be.calledTwice;
        expect(validatedSpy.firstCall).to.be.calledAfter(valueChangedSpy.firstCall);
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy.firstCall).to.be.calledAfter(validatedSpy.firstCall);
        expect(datePicker.value).to.equal('');
      });

      it('should commit on Enter after clearing', async () => {
        await sendKeys({ press: 'Enter' });
        expect(valueChangedSpy).to.be.calledOnce;
        expect(validatedSpy).to.be.calledOnce;
        expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('');
      });

      it('should commit on Escape after clearing', async () => {
        await sendKeys({ press: 'Escape' });
        expect(valueChangedSpy).to.be.calledOnce;
        expect(validatedSpy).to.be.calledOnce;
        expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('');
      });
    });
  });
});
