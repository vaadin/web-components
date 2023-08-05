import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, outsideClick, tap } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { waitForOverlayRender } from './helpers.js';

const TODAY_DATE = new Date().toISOString().split('T')[0];

describe('value commit', () => {
  let datePicker, valueChangedSpy, validatedSpy, changeSpy;

  beforeEach(async () => {
    datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
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
    it('should not commit on blur', () => {
      datePicker.blur();
      expect(valueChangedSpy).to.be.not.called;
      // expect(validatedSpy).to.be.not.called;
      expect(changeSpy).to.be.not.called;
    });

    it('should not commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(valueChangedSpy).to.be.not.called;
      // expect(validatedSpy).to.be.not.called;
      expect(changeSpy).to.be.not.called;
    });

    it('should not commit on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expect(valueChangedSpy).to.be.not.called;
      // expect(validatedSpy).to.be.not.called;
      expect(changeSpy).to.be.not.called;
    });

    it('should not commit on close with outside click', async () => {
      datePicker.click();
      await waitForOverlayRender();
      outsideClick();
      expect(valueChangedSpy).to.be.not.called;
      // expect(validatedSpy).to.be.not.called;
      expect(changeSpy).to.be.not.called;
    });

    it('should not commit on close with Escape', async () => {
      datePicker.click();
      await waitForOverlayRender();
      await sendKeys({ press: 'Escape' });
      expect(valueChangedSpy).to.be.not.called;
      // expect(validatedSpy).to.be.not.called;
      expect(changeSpy).to.be.not.called;
    });
  });

  describe('user input', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1/1/2001' });
      await waitForOverlayRender();
    });

    // TODO: This test doesn't work when autoOpenDisabled = false
    // it('should commit on blur', async () => {
    //   datePicker.blur();
    //   expect(valueChangedSpy).to.be.calledOnce;
    //   // TODO: Why is value-changed fired after validation?
    //   // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
    //   expect(validatedSpy).to.be.calledOnce;
    //   expect(changeSpy).to.be.calledOnce;
    //   expect(changeSpy).to.be.calledAfter(validatedSpy);
    //   expect(datePicker.value).to.equal('2001-01-01');
    // });

    it('should commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(valueChangedSpy).to.be.calledOnce;
      // TODO: Why is value-changed fired after validation?
      // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledAfter(validatedSpy);
      expect(datePicker.value).to.equal('2001-01-01');
    });

    it('should commit on close with outside click', () => {
      outsideClick();
      expect(valueChangedSpy).to.be.calledOnce;
      // TODO: Why is value-changed fired after validation?
      // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledAfter(validatedSpy);
      expect(datePicker.value).to.equal('2001-01-01');
    });

    it('should revert on close with Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expect(valueChangedSpy).to.be.not.called;
      // TODO: Why is validation triggered on revert?
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.not.called;
      expect(datePicker.value).to.equal('');
      expect(datePicker.inputElement.value).to.equal('');
    });
  });

  describe('bad input', () => {
    beforeEach(async () => {
      await sendKeys({ type: 'INVALID' });
      await waitForOverlayRender();
    });

    it('should not commit but validate on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(valueChangedSpy).to.be.not.called;
      // TODO: Why is validation triggered twice?
      expect(validatedSpy).to.be.calledTwice;
      expect(changeSpy).to.be.not.called;
      expect(datePicker.value).to.equal('');
      expect(datePicker.inputElement.value).to.equal('INVALID');
    });

    it('should not commit but validate on close with outside click', async () => {
      outsideClick();
      expect(valueChangedSpy).to.be.not.called;
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.not.called;
      expect(datePicker.value).to.equal('');
      expect(datePicker.inputElement.value).to.equal('INVALID');
    });

    it('should revert on close with Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expect(valueChangedSpy).to.be.not.called;
      // TODO: Why is validation triggered on revert?
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.not.called;
      expect(datePicker.value).to.equal('');
      expect(datePicker.inputElement.value).to.equal('');
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
      expect(valueChangedSpy).to.be.calledOnce;
      // TODO: Why is value-changed fired after validation?
      // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledAfter(validatedSpy);
      expect(datePicker.value).to.equal(TODAY_DATE);
    });

    it('should commit on selection with Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(valueChangedSpy).to.be.calledOnce;
      // TODO: Why is value-changed fired after validation?
      // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledAfter(validatedSpy);
      expect(datePicker.value).to.equal(TODAY_DATE);
    });

    it('should commit on selection with Space', async () => {
      await sendKeys({ press: 'Space' });
      expect(valueChangedSpy).to.be.calledOnce;
      // TODO: Why is value-changed fired after validation?
      // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledAfter(validatedSpy);
      expect(datePicker.value).to.equal(TODAY_DATE);
    });
  });

  describe('with value', () => {
    let initialValue, initialInputElementValue;

    beforeEach(() => {
      datePicker.value = TODAY_DATE;
      initialValue = datePicker.value;
      initialInputElementValue = datePicker.inputElement.value;
      valueChangedSpy.resetHistory();
      validatedSpy.resetHistory();
    });

    describe('default', () => {
      it('should not commit on blur', () => {
        datePicker.blur();
        expect(valueChangedSpy).to.be.not.called;
        // expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
      });

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expect(valueChangedSpy).to.be.not.called;
        // expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
      });

      it('should not commit on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expect(valueChangedSpy).to.be.not.called;
        // expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
      });

      it('should not commit on close with outside click', async () => {
        datePicker.click();
        await waitForOverlayRender();
        outsideClick();
        expect(valueChangedSpy).to.be.not.called;
        // expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
      });

      it('should not commit on close with Escape', async () => {
        datePicker.click();
        await waitForOverlayRender();
        await sendKeys({ press: 'Escape' });
        expect(valueChangedSpy).to.be.not.called;
        // expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
      });
    });

    describe('user input', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ type: '1/1/2001' });
        await waitForOverlayRender();
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expect(valueChangedSpy).to.be.calledOnce;
        // TODO: Why is value-changed fired after validation?
        // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('2001-01-01');
      });

      it('should commit on close with outside click', () => {
        outsideClick();
        expect(valueChangedSpy).to.be.calledOnce;
        // TODO: Why is value-changed fired after validation?
        // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('2001-01-01');
      });

      it('should revert on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expect(valueChangedSpy).to.be.not.called;
        expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
        expect(datePicker.value).to.equal(initialValue);
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('bad input', () => {
      beforeEach(async () => {
        await sendKeys({ type: 'INVALID' });
        await waitForOverlayRender();
      });

      it('should revert on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expect(valueChangedSpy).to.be.not.called;
        // TODO: Why is validation triggered on revert?
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.not.called;
        expect(datePicker.value).to.equal(initialValue);
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });

      it('should revert on close with outside click', async () => {
        outsideClick();
        expect(valueChangedSpy).to.be.not.called;
        expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
        expect(datePicker.value).to.equal(initialValue);
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });

      it('should revert on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expect(valueChangedSpy).to.be.not.called;
        expect(validatedSpy).to.be.not.called;
        expect(changeSpy).to.be.not.called;
        expect(datePicker.value).to.equal(initialValue);
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('overlay', () => {
      beforeEach(async () => {
        await sendKeys({ press: 'ArrowDown' });
        await waitForOverlayRender();
      });

      it('should commit on unselection with Space', async () => {
        await sendKeys({ press: 'Space' });
        expect(valueChangedSpy).to.be.calledOnce;
        // TODO: Why is value-changed fired after validation?
        // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('');
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
        expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        // TODO: Why is validation triggered twice?
        expect(validatedSpy).to.be.calledTwice;
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('');
      });

      it('should commit on Enter after clearing', async () => {
        await sendKeys({ press: 'Enter' });
        expect(valueChangedSpy).to.be.calledOnce;
        // TODO: Why is value-changed fired after validation?
        // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('');
      });

      it('should commit on close with outside click after clearing', () => {
        outsideClick();
        expect(valueChangedSpy).to.be.calledOnce;
        expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        // TODO: Why is validation triggered twice?
        expect(validatedSpy).to.be.calledTwice;
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('');
      });

      it('should commit on close with Escape after clearing', async () => {
        await sendKeys({ press: 'Escape' });
        expect(valueChangedSpy).to.be.calledOnce;
        // TODO: Why is value-changed fired after validation?
        // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('');
      });
    });

    describe('with clear button', () => {
      beforeEach(() => {
        datePicker.clearButtonVisible = true;
      });

      it('should clear on clear button click', () => {
        datePicker.$.clearButton.click();
        expect(valueChangedSpy).to.be.calledOnce;
        expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('');
      });

      it('should clear on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expect(valueChangedSpy).to.be.calledOnce;
        expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
        expect(validatedSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledOnce;
        expect(changeSpy).to.be.calledAfter(validatedSpy);
        expect(datePicker.value).to.equal('');
      });
    });
  });
});
