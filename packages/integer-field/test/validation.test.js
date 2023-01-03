import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-integer-field.js';

describe('validation', () => {
  let integerField;

  describe('initial', () => {
    let validateSpy;

    beforeEach(() => {
      integerField = document.createElement('vaadin-integer-field');
      validateSpy = sinon.spy(integerField, 'validate');
    });

    afterEach(() => {
      integerField.remove();
    });

    it('should not validate without value', async () => {
      document.body.appendChild(integerField);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    describe('with value', () => {
      beforeEach(() => {
        integerField.value = '2';
      });

      it('should not validate without constraints', async () => {
        document.body.appendChild(integerField);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate without constraints when the field has invalid', async () => {
        integerField.invalid = true;
        document.body.appendChild(integerField);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should validate when the field has min', async () => {
        integerField.min = 2;
        document.body.appendChild(integerField);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate when the field has max', async () => {
        integerField.max = 2;
        document.body.appendChild(integerField);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate when the field has step', async () => {
        integerField.step = 2;
        document.body.appendChild(integerField);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });
    });
  });

  describe('basic', () => {
    beforeEach(() => {
      integerField = fixtureSync('<vaadin-integer-field></vaadin-integer-field>');
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      integerField.addEventListener('validated', validatedSpy);
      integerField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      integerField.addEventListener('validated', validatedSpy);
      integerField.required = true;
      integerField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('bad input', () => {
    let input;

    beforeEach(() => {
      integerField = fixtureSync('<vaadin-integer-field></vaadin-integer-field>');
      input = integerField.inputElement;
      input.focus();
    });

    it('should be valid when committing a valid number', async () => {
      await sendKeys({ type: '1' });
      input.blur();
      expect(integerField.invalid).to.be.false;
    });

    it('should be invalid when trying to commit an invalid number', async () => {
      await sendKeys({ type: '1--' });
      input.blur();
      expect(integerField.invalid).to.be.true;
    });

    it('should set an empty value when trying to commit an invalid number', async () => {
      integerField.value = '1';
      await sendKeys({ type: '1--' });
      await sendKeys({ type: 'Enter' });
      expect(integerField.value).to.equal('');
    });

    it('should be valid after removing an invalid number', async () => {
      await sendKeys({ type: '1--' });
      input.blur();
      input.focus();
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      input.blur();
      expect(integerField.invalid).to.be.false;
    });
  });
});
