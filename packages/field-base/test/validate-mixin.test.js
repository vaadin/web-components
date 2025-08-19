import { expect } from '@vaadin/chai-plugins';
import { definePolymer, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ValidateMixin } from '../src/validate-mixin.js';

describe('ValidateMixin', () => {
  const tag = definePolymer('validate-mixin', '<input>', (Base) => class extends ValidateMixin(Base) {});

  let element;

  describe('properties', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
    });

    it('should reflect required property to attribute', () => {
      expect(element.hasAttribute('required')).to.be.false;

      element.required = true;
      expect(element.hasAttribute('required')).to.be.true;
    });

    it('should reflect invalid property to attribute', () => {
      expect(element.hasAttribute('invalid')).to.be.false;

      element.invalid = true;
      expect(element.hasAttribute('invalid')).to.be.true;
    });

    it('should have manual validation disabled by default', () => {
      expect(element.manualValidation).to.be.false;
    });

    it('should fire invalid-changed event on invalid property change', () => {
      const spy = sinon.spy();
      element.addEventListener('invalid-changed', spy);
      element.invalid = true;
      expect(spy.calledOnce).to.be.true;

      spy.resetHistory();
      element.invalid = false;
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate on _requestValidation() when manualValidation is false', () => {
      const spy = sinon.spy(element, 'validate');
      element._requestValidation();
      expect(spy).to.be.calledOnce;
    });

    it('should not validate on _requestValidation() when manualValidation is true', () => {
      const spy = sinon.spy(element, 'validate');
      element.manualValidation = true;
      element._requestValidation();
      expect(spy).to.be.not.called;
    });
  });

  describe('checkValidity', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></$${tag}>`);
      await nextRender();
    });

    it('should return true when element is not required', () => {
      expect(element.checkValidity()).to.be.true;
    });

    it('should return false when element is required and value is not set', () => {
      element.required = true;
      expect(element.checkValidity()).to.be.false;
    });

    it('should return true when element is required and value is set', () => {
      element.required = true;
      element.value = 'value';
      expect(element.checkValidity()).to.be.true;
    });

    it('should still return result when manualValidation is true', () => {
      element.manualValidation = true;
      element.required = true;
      expect(element.checkValidity()).to.be.false;
    });
  });

  describe('validate', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
    });

    it('should return true when element is not required', () => {
      expect(element.validate()).to.be.true;
    });

    it('should return false when element is required and value is not set', () => {
      element.required = true;
      expect(element.validate()).to.be.false;
    });

    it('should return true when element is required and value is set', () => {
      element.required = true;
      element.value = 'value';
      expect(element.validate()).to.be.true;
    });

    it('should not set invalid to true when element is not required', () => {
      element.validate();
      expect(element.invalid).to.be.false;
    });

    it('should set invalid when element is required and value is not set', () => {
      element.required = true;
      element.validate();
      expect(element.invalid).to.be.true;
    });

    it('should not set invalid to true when element is required and value is set', () => {
      element.required = true;
      element.value = 'value';
      element.validate();
      expect(element.invalid).to.be.false;
    });

    it('should set invalid back to false after value is set on the element', () => {
      element.required = true;
      element.validate();

      element.value = 'value';
      element.validate();
      expect(element.invalid).to.be.false;
    });

    it('should still validate when manualValidation is true', () => {
      element.manualValidation = true;
      element.required = true;
      element.validate();
      expect(element.invalid).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      element.addEventListener('validated', validatedSpy);
      element.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      element.addEventListener('validated', validatedSpy);
      element.required = true;
      element.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('invalid cannot be set to false', () => {
    const tagWithShouldSetInvalid = definePolymer(
      'validate-mixin-with-should-set-invalid',
      '<input>',
      (Base) =>
        class extends ValidateMixin(Base) {
          _shouldSetInvalid(invalid) {
            return invalid;
          }
        },
    );

    beforeEach(async () => {
      element = fixtureSync(`<${tagWithShouldSetInvalid}></${tagWithShouldSetInvalid}>`);
      await nextRender();
    });

    it('should set invalid only when it is true', () => {
      element.required = true;
      element.validate();
      expect(element.invalid).to.be.true;
      element.value = 'value';
      element.validate();
      expect(element.invalid).to.be.true;
    });
  });
});
