import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, outsideClick, tap } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { waitForOverlayRender } from './helpers.js';

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
      await sendKeys({ type: '1/1/2023' });
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
      expect(datePicker.value).to.equal('2023-01-01');
    });

    it('should commit on close with outside click', () => {
      outsideClick();
      expect(valueChangedSpy).to.be.calledOnce;
      // TODO: Why is value-changed fired after validation?
      // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledAfter(validatedSpy);
      expect(datePicker.value).to.equal('2023-01-01');
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
      expect(valueChangedSpy).to.not.be.called;
      // TODO: Why is validation triggered twice?
      expect(validatedSpy).to.be.calledTwice;
      expect(changeSpy).to.not.be.called;
      expect(datePicker.value).to.equal('');
      expect(datePicker.inputElement.value).to.equal('INVALID');
    });

    it('should not commit but validate on close with outside click', async () => {
      outsideClick();
      expect(valueChangedSpy).to.not.be.called;
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.not.be.called;
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

  describe('dropdown', () => {
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
      // TODO: Today date
      expect(datePicker.value).to.equal('2023-08-04');
    });

    it('should commit on selection with Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(valueChangedSpy).to.be.calledOnce;
      // TODO: Why is value-changed fired after validation?
      // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledAfter(validatedSpy);
      // TODO: Today date
      expect(datePicker.value).to.equal('2023-08-04');
    });

    it('should commit on selection with Space', async () => {
      await sendKeys({ press: 'Space' });
      expect(valueChangedSpy).to.be.calledOnce;
      // TODO: Why is value-changed fired after validation?
      // expect(validatedSpy).to.be.calledAfter(valueChangedSpy);
      expect(validatedSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledOnce;
      expect(changeSpy).to.be.calledAfter(validatedSpy);
      // TODO: Today date
      expect(datePicker.value).to.equal('2023-08-04');
    });
  });

  describe('with value', () => {
    describe('default', () => {
      it('should not commit on blur');
      it('should not commit on Enter');
      it('should not commit on Escape');
      it('should not commit on close with outside click');
      it('should not commit on close with Escape');
    });

    describe('user input', () => {
      it('should commit on Enter');
      it('should commit on blur');
      it('should commit on close with outside click');
    });

    describe('bad input', () => {
      it('should clear on blur');
      it('should clear on Enter');
      it('should clear on close with outside click');
      it('should revert on close with Escape');
    });

    describe('clearing with Backspace', () => {
      it('should commit on Enter after clearing');
      it('should commit on blur after clearing');
      it('should commit on close with outside click after clearing');
      it('should commit on close with Escape after clearing');
    });

    describe('dropdown', () => {
      it('should commit on selection with click');
      it('should commit on selection with Enter');
      it('should commit on selection with Space');
    });

    describe('with clear button', () => {
      it('should clear on clear button click');
      it('should clear on Escape');
    });
  });
});
