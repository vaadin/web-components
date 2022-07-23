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

    it('should not validate by default', async () => {
      document.body.appendChild(integerField);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      integerField.value = '2';
      document.body.appendChild(integerField);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      integerField.value = '2';
      integerField.invalid = true;
      document.body.appendChild(integerField);
      await nextRender();
      expect(validateSpy.called).to.be.false;
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

    it('should be invalid when trying to commit a not valid number', async () => {
      await sendKeys({ type: '1--' });
      input.blur();
      expect(integerField.invalid).to.be.true;
    });

    it('should set an empty value when trying to commit a not valid number', async () => {
      integerField.value = '1';
      await sendKeys({ type: '1--' });
      await sendKeys({ type: 'Enter' });
      expect(integerField.value).to.equal('');
    });
  });
});
