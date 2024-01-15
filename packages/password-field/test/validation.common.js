import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';

describe('validation', () => {
  let passwordField;

  describe('initial', () => {
    let validateSpy;

    beforeEach(() => {
      passwordField = document.createElement('vaadin-password-field');
      validateSpy = sinon.spy(passwordField, 'validate');
    });

    afterEach(() => {
      passwordField.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(passwordField);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      passwordField.value = 'Initial Value';
      document.body.appendChild(passwordField);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      passwordField.value = 'Initial Value';
      passwordField.invalid = true;
      document.body.appendChild(passwordField);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('basic', () => {
    beforeEach(async () => {
      passwordField = fixtureSync('<vaadin-password-field></vaadin-password-field>');
      await nextRender();
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      passwordField.addEventListener('validated', validatedSpy);
      passwordField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', async () => {
      const validatedSpy = sinon.spy();
      passwordField.addEventListener('validated', validatedSpy);
      passwordField.required = true;
      await nextUpdate(passwordField);
      passwordField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('invalid', () => {
    beforeEach(async () => {
      passwordField = fixtureSync('<vaadin-password-field invalid></vaadin-password-field>');
      await nextRender();
    });

    it('should not remove "invalid" state when ready', () => {
      expect(passwordField.invalid).to.be.true;
    });
  });

  describe('invalid with value', () => {
    beforeEach(async () => {
      passwordField = fixtureSync('<vaadin-password-field invalid value="123456"></vaadin-password-field>');
      await nextRender();
    });

    it('should not remove "invalid" state when ready', () => {
      expect(passwordField.invalid).to.be.true;
    });
  });
});
