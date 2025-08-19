import { expect } from '@vaadin/chai-plugins';
import { definePolymer, fire, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { InputConstraintsMixin } from '../src/input-constraints-mixin.js';
import { InputController } from '../src/input-controller.js';

describe('InputConstraintsMixin', () => {
  const tag = definePolymer(
    'input-constraints-mixin',
    '<slot name="input"></slot>',
    (Base) =>
      class extends InputConstraintsMixin(ControllerMixin(Base)) {
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
        await nextUpdate(element);
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate on removing a non-final constraint when the field is valid', async () => {
        element.pattern = '\\d*';
        element.minlength = 2;
        await nextUpdate(element);
        expect(element.invalid).to.be.false;
        validateSpy.resetHistory();
        element.minlength = 2;
        await nextUpdate(element);
        expect(validateSpy.called).to.be.false;
      });

      it('should validate on removing a non-final constraint when the field is invalid', async () => {
        element.required = true;
        element.pattern = '\\d*';
        await nextUpdate(element);
        element.validate();
        expect(element.invalid).to.be.true;
        validateSpy.resetHistory();
        element.required = false;
        await nextUpdate(element);
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
        await nextUpdate(element);
        expect(spy.calledOnce).to.be.true;
      });

      it('should validate on setting a boolean constraint', async () => {
        element.required = true;
        await nextUpdate(element);
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should reset invalid on removing a boolean constraint', async () => {
        element.required = true;
        element.invalid = true;
        await nextUpdate(element);

        element.required = false;
        await nextUpdate(element);
        expect(element.invalid).to.be.false;
      });

      it('should validate on setting a number constraint', async () => {
        element.minlength = 2;
        await nextUpdate(element);
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate on setting a number constraint to 0', async () => {
        element.minlength = 0;
        await nextUpdate(element);
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should reset invalid on removing a number constraint', async () => {
        element.minlength = 50;
        element.invalid = true;
        await nextUpdate(element);

        element.minlength = null;
        await nextUpdate(element);
        expect(element.invalid).to.be.false;
      });

      it('should validate on setting a string constraint', async () => {
        element.pattern = '[-+\\d]';
        await nextUpdate(element);
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should reset invalid on removing a string constraint', async () => {
        element.pattern = '[-+\\d]';
        element.invalid = true;
        await nextUpdate(element);

        element.pattern = '';
        await nextUpdate(element);
        expect(element.invalid).to.be.false;
      });

      it('should validate on removing a non-final constraint', async () => {
        element.required = true;
        element.minlength = 2;
        await nextUpdate(element);
        validateSpy.resetHistory();

        element.minlength = null;
        await nextUpdate(element);
        expect(validateSpy.calledOnce).to.be.true;
      });
    });

    describe('with invalid value + constraint', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} value="Value" pattern="\\d+"></${tag}>`);
        await nextRender();
      });

      it('should be invalid', () => {
        expect(element.invalid).to.be.true;
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

    describe('manual validation', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} manual-validation></${tag}>`);
        await nextRender();
        validateSpy = sinon.spy(element, 'validate');
      });

      it('should not validate when adding constraints', async () => {
        element.value = 'foo';
        element.required = true;
        await nextUpdate(element);
        expect(validateSpy).to.be.not.called;
      });

      it('should not validate when removing constraints', async () => {
        element.value = 'foo';
        element.required = true;
        element.minlength = 2;
        await nextUpdate(element);
        element.minlength = null;
        await nextUpdate(element);
        expect(validateSpy).to.be.not.called;
      });

      it('should not reset invalid when removing last constraint', async () => {
        element.invalid = true;
        element.required = true;
        await nextUpdate(element);
        element.required = false;
        await nextUpdate(element);
        expect(element.invalid).to.be.true;
      });

      it('should not validate on input change event', () => {
        input.value = 'foo';
        fire(input, 'change');
        expect(validateSpy).to.be.not.called;
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
});
