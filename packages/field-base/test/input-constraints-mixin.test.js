import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { InputConstraintsMixin } from '../src/input-constraints-mixin.js';
import { InputController } from '../src/input-controller.js';
import { define } from './helpers.js';

const runTests = (baseClass) => {
  const tag = define[baseClass](
    'input-constraints-mixin',
    '<slot name="input"></slot>',
    (Base) =>
      class extends InputConstraintsMixin(Base) {
        static get properties() {
          return {
            minlength: {
              type: Number,
            },
            maxlength: {
              type: Number,
            },
            pattern: {
              type: String,
            },
          };
        }

        static get delegateAttrs() {
          return [...super.delegateAttrs, 'minlength', 'maxlength', 'pattern'];
        }

        static get constraints() {
          return [...super.constraints, 'minlength', 'maxlength', 'pattern'];
        }

        ready() {
          super.ready();

          this.addController(
            new InputController(this, (input) => {
              this._setInputElement(input);
              this.stateTarget = input;
            }),
          );
        }
      },
  );

  let element, input;

  beforeEach(async () => {
    element = fixtureSync(`<${tag}></${tag}>`);
    await nextRender();
    input = element.querySelector('[slot=input]');
  });

  describe('validation', () => {
    it('should not validate the field when minlength is set', async () => {
      element.minlength = 2;
      await nextFrame();
      expect(element.invalid).to.be.false;
    });

    it('should not validate the field when maxlength is set', async () => {
      element.maxlength = 6;
      await nextFrame();
      expect(element.invalid).to.be.false;
    });

    it('should not validate the field when pattern is set', async () => {
      element.pattern = '[-+\\d]';
      await nextFrame();
      expect(element.invalid).to.be.false;
    });

    it('should validate the field when invalid after minlength is changed', async () => {
      element.invalid = true;
      await nextFrame();
      const spy = sinon.spy(element, 'validate');
      element.minlength = 2;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate the field when invalid after maxlength is changed', async () => {
      element.invalid = true;
      await nextFrame();
      const spy = sinon.spy(element, 'validate');
      element.maxlength = 6;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate the field when invalid after minlength is set to 0', async () => {
      element.invalid = true;
      await nextFrame();
      const spy = sinon.spy(element, 'validate');
      element.minlength = 0;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate the field when invalid after maxlength is set to 0', async () => {
      element.invalid = true;
      await nextFrame();
      const spy = sinon.spy(element, 'validate');
      element.maxlength = 0;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate the field when invalid after pattern is changed', async () => {
      element.invalid = true;
      await nextFrame();
      const spy = sinon.spy(element, 'validate');
      element.pattern = '[-+\\d]';
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should call checkValidity on the input when invalid after minlength is changed', async () => {
      element.invalid = true;
      await nextFrame();
      const spy = sinon.spy(input, 'checkValidity');
      element.minlength = 2;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should call checkValidity on the input when invalid after maxlength is changed', async () => {
      element.invalid = true;
      await nextFrame();
      const spy = sinon.spy(input, 'checkValidity');
      element.maxlength = 6;
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should call checkValidity on the input when invalid after pattern is changed', async () => {
      element.invalid = true;
      await nextFrame();
      const spy = sinon.spy(input, 'checkValidity');
      element.pattern = '[-+\\d]';
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should update invalid state when required is removed', async () => {
      element.required = true;
      await nextFrame();
      element.validate();
      expect(element.invalid).to.be.true;

      element.required = false;
      await nextFrame();
      expect(element.invalid).to.be.false;
    });

    it('should update invalid state when pattern is removed', async () => {
      input.value = '123foo';
      element.pattern = '\\d+';
      await nextFrame();

      element.validate();
      expect(element.invalid).to.be.true;

      element.pattern = '';
      await nextFrame();
      expect(element.invalid).to.be.false;
    });

    it('should update invalid state when a constraint is removed even if other constraints are active', async () => {
      element.required = true;
      element.pattern = '\\d*';
      await nextFrame();

      element.validate();
      expect(element.invalid).to.be.true;

      element.required = false;
      await nextFrame();
      expect(element.invalid).to.be.false;
    });

    it('should override explicitly set invalid when required is set', async () => {
      element.invalid = true;
      element.value = 'foo';
      await nextFrame();

      element.required = true;
      await nextFrame();
      expect(element.invalid).to.be.false;
    });

    it('should call validate on change event from the input', () => {
      const spy = sinon.spy(element, 'validate');
      input.value = '123foo';
      input.dispatchEvent(new CustomEvent('change'));
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch change event after validation', () => {
      const validateSpy = sinon.spy(element, 'validate');
      const changeSpy = sinon.spy();
      element.addEventListener('change', changeSpy);
      input.value = '123foo';
      input.dispatchEvent(new CustomEvent('change'));
      expect(validateSpy.calledOnce).to.be.true;
      expect(changeSpy.calledAfter(validateSpy)).to.be.true;
    });

    it('should store reference on the original change event', () => {
      const changeSpy = sinon.spy();
      element.addEventListener('change', changeSpy);
      input.value = '123foo';
      const event = new CustomEvent('change');
      input.dispatchEvent(event);
      expect(changeSpy.firstCall.args[0].detail.sourceEvent).to.equal(event);
    });
  });

  describe('checkValidity', () => {
    it('should return true when called before connected to the DOM', () => {
      const field = document.createElement(tag);
      expect(field.checkValidity()).to.be.true;
    });

    it('should return false when called before connected to the DOM and invalid', () => {
      const field = document.createElement(tag);
      field.invalid = true;
      expect(field.checkValidity()).to.be.false;
    });
  });
};

describe('InputConstraintsMixin + Polymer', () => {
  runTests('polymer');
});

describe('InputConstraintsMixin + Lit', () => {
  runTests('lit');
});
