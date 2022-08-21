import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
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
            pattern: {
              type: String,
            },
          };
        }

        static get delegateAttrs() {
          return [...super.delegateAttrs, 'minlength', 'pattern'];
        }

        static get constraints() {
          return [...super.constraints, 'minlength', 'pattern'];
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

  describe('validation', () => {
    let element, input, validateSpy;

    describe('initial', () => {
      beforeEach(() => {
        element = document.createElement(tag);
        validateSpy = sinon.spy(element, 'validate');
      });

      afterEach(() => {
        element.remove();
      });

      it('should not validate without value', async () => {
        document.body.appendChild(element);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate without value when the field has invalid', async () => {
        element.invalid = true;
        document.body.appendChild(element);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      describe('with value', () => {
        beforeEach(() => {
          element.value = 'Value';
        });

        it('should not validate without constraints', async () => {
          document.body.appendChild(element);
          await nextRender();
          expect(validateSpy.called).to.be.false;
        });

        it('should not validate without constraints when the field has invalid', async () => {
          element.invalid = true;
          document.body.appendChild(element);
          await nextRender();
          expect(validateSpy.called).to.be.false;
        });

        it('should validate when the field has a constraint', async () => {
          element.minlength = 2;
          document.body.appendChild(element);
          await nextRender();
          expect(validateSpy.calledOnce).to.be.true;
        });
      });
    });

    describe('without value', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await nextRender();
        validateSpy = sinon.spy(element, 'validate');
      });

      it('should not validate on setting a constraint', async () => {
        element.required = true;
        await nextFrame();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate on removing a non-final constraint when the field is valid', async () => {
        element.pattern = '\\d*';
        element.minlength = 2;
        await nextFrame();
        expect(element.invalid).to.be.false;
        validateSpy.resetHistory();
        element.minlength = 2;
        await nextFrame();
        expect(validateSpy.called).to.be.false;
      });

      it('should validate on removing a non-final constraint when the field is invalid', async () => {
        element.required = true;
        element.pattern = '\\d*';
        await nextFrame();
        element.validate();
        expect(element.invalid).to.be.true;
        validateSpy.resetHistory();
        element.required = false;
        await nextFrame();
        expect(validateSpy.calledOnce).to.be.true;
      });
    });

    describe('with value', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} value="Value"></${tag}>`);
        await nextRender();
        validateSpy = sinon.spy(element, 'validate');
        input = element.querySelector('[slot=input]');
      });

      it('should call checkValidity on the input on setting a constraint', async () => {
        const spy = sinon.spy(input, 'checkValidity');
        element.minlength = 2;
        await nextFrame();
        expect(spy.calledOnce).to.be.true;
      });

      it('should validate on setting a boolean constraint', async () => {
        element.required = true;
        await nextFrame();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should reset invalid on removing a boolean constraint', async () => {
        element.required = true;
        element.invalid = true;
        await nextFrame();

        element.required = false;
        await nextFrame();
        expect(element.invalid).to.be.false;
      });

      it('should validate on setting a number constraint', async () => {
        element.minlength = 2;
        await nextFrame();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate on setting a number constraint to 0', async () => {
        element.minlength = 0;
        await nextFrame();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should reset invalid on removing a number constraint', async () => {
        element.minlength = 50;
        element.invalid = true;
        await nextFrame();

        element.minlength = null;
        await nextFrame();
        expect(element.invalid).to.be.false;
      });

      it('should validate on setting a string constraint', async () => {
        element.pattern = '[-+\\d]';
        await nextFrame();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should reset invalid on removing a string constraint', async () => {
        element.pattern = '[-+\\d]';
        element.invalid = true;
        await nextFrame();

        element.pattern = '';
        await nextFrame();
        expect(element.invalid).to.be.false;
      });

      it('should validate on removing a non-final constraint', async () => {
        element.required = true;
        element.minlength = 2;
        await nextFrame();
        validateSpy.resetHistory();

        element.minlength = null;
        await nextFrame();
        expect(validateSpy.calledOnce).to.be.true;
      });
    });

    describe('change event', () => {
      let changeSpy;

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await nextRender();
        changeSpy = sinon.spy();
        element.addEventListener('change', changeSpy);
        input = element.querySelector('[slot=input]');
      });

      it('should validate on input change event', () => {
        input.value = '123foo';
        fire(input, 'change');
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should dispatch change event after validation', () => {
        input.value = '123foo';
        fire(input, 'change');
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      it('should store a reference to the original change event', () => {
        input.value = '123foo';
        const event = fire(input, 'change');
        expect(changeSpy.firstCall.args[0].detail.sourceEvent).to.equal(event);
      });
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
