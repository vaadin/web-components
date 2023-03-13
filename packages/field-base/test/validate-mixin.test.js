import { expect } from '@esm-bundle/chai';
import { defineLit, definePolymer, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ValidateMixin } from '../src/validate-mixin.js';

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper('validate-mixin', '<input>', (Base) => class extends ValidateMixin(baseMixin(Base)) {});

  let element;

  describe('properties', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
    });

    it('should reflect required property to attribute', async () => {
      expect(element.hasAttribute('required')).to.be.false;

      element.required = true;
      await nextFrame();
      expect(element.hasAttribute('required')).to.be.true;
    });

    it('should reflect invalid property to attribute', async () => {
      expect(element.hasAttribute('invalid')).to.be.false;

      element.invalid = true;
      await nextFrame();
      expect(element.hasAttribute('invalid')).to.be.true;
    });

    it('should fire invalid-changed event on invalid property change', async () => {
      const spy = sinon.spy();
      element.addEventListener('invalid-changed', spy);
      element.invalid = true;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;

      spy.resetHistory();
      element.invalid = false;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
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
    const tagWithShouldSetInvalid = defineHelper(
      'validate-mixin-with-should-set-invalid',
      '<input>',
      (Base) =>
        class extends ValidateMixin(baseMixin(Base)) {
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
};

describe('ValidateMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('ValidateMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
