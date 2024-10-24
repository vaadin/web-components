import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-custom-field.js';

describe('validation', () => {
  let customField;

  describe('basic', () => {
    let validateSpy;

    beforeEach(async () => {
      customField = fixtureSync(`
        <vaadin-custom-field>
          <input type="text" />
          <input type="number" />
        </vaadin-custom-field>
      `);
      await nextRender();
      validateSpy = sinon.spy(customField, 'validate');
    });

    it('should pass validation by default', () => {
      expect(customField.validate()).to.be.true;
      expect(customField.checkValidity()).to.be.true;
    });

    it('should validate on blur', () => {
      customField.inputs[0].focus();
      customField.inputs[0].blur();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on input change', () => {
      customField.inputs[0].value = 'foo';
      fire(customField.inputs[0], 'change');
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on value change', () => {
      customField.value = 'foo,1';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      customField.addEventListener('validated', validatedSpy);
      customField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      customField.addEventListener('validated', validatedSpy);
      customField.required = true;
      customField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });

    it('should not throw when checkValidity() called without inputs', () => {
      expect(() => {
        document.createElement('vaadin-custom-field').checkValidity();
      }).to.not.throw(Error);
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      customField = fixtureSync(`
        <vaadin-custom-field required>
          <input type="text" />
          <input type="number" />
        </vaadin-custom-field>
      `);
      await nextRender();
    });

    it('should set invalid to false by default', () => {
      expect(customField.invalid).to.be.false;
    });

    it('should become invalid on validate call when empty', () => {
      expect(customField.invalid).to.be.false;
      customField.validate();
      expect(customField.invalid).to.be.true;
    });

    it('should return false on checkValidity call when value is set to null', () => {
      customField.value = null;
      expect(customField.checkValidity()).to.be.false;
    });

    it('should become valid after receiving a non-empty value from "change" event', () => {
      customField.inputs[0].value = 'foo';
      fire(customField.inputs[0], 'change');
      expect(customField.invalid).to.be.false;
    });

    it('should become invalid after receiving an empty value from "change" event', () => {
      customField.value = 'foo';
      customField.inputs[0].value = '';
      fire(customField.inputs[0], 'change');
      expect(customField.invalid).to.be.true;
    });

    it('should validate when setting required to false', () => {
      const validateSpy = sinon.spy(customField, 'validate');
      customField.required = false;
      expect(validateSpy).to.be.calledOnce;
    });
  });
});
