import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { InputConstraintsMixin } from '../src/input-constraints-mixin.js';
import { InputController } from '../src/input-controller.js';

customElements.define(
  'input-constraints-mixin-element',
  class extends InputConstraintsMixin(ControllerMixin(PolymerElement)) {
    static get template() {
      return html`
        <slot name="input"></slot>
        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
        <slot name="helper"></slot>
      `;
    }

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

    constructor() {
      super();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this.stateTarget = input;
        }),
      );
    }
  },
);

describe('input-constraints-mixin', () => {
  let element, input;

  beforeEach(() => {
    element = fixtureSync('<input-constraints-mixin-element></input-constraints-mixin-element>');
    input = element.querySelector('[slot=input]');
  });

  describe('validation', () => {
    it('should not validate the field when minlength is set', () => {
      element.minlength = 2;
      expect(element.invalid).to.be.false;
    });

    it('should not validate the field when maxlength is set', () => {
      element.maxlength = 6;
      expect(element.invalid).to.be.false;
    });

    it('should not validate the field when pattern is set', () => {
      element.pattern = '[-+\\d]';
      expect(element.invalid).to.be.false;
    });

    it('should validate the field when invalid after minlength is changed', () => {
      element.invalid = true;
      const spy = sinon.spy(element, 'validate');
      element.minlength = 2;
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate the field when invalid after maxlength is changed', () => {
      element.invalid = true;
      const spy = sinon.spy(element, 'validate');
      element.maxlength = 6;
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate the field when invalid after minlength is set to 0', () => {
      element.invalid = true;
      const spy = sinon.spy(element, 'validate');
      element.minlength = 0;
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate the field when invalid after maxlength is set to 0', () => {
      element.invalid = true;
      const spy = sinon.spy(element, 'validate');
      element.maxlength = 0;
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate the field when invalid after pattern is changed', () => {
      element.invalid = true;
      const spy = sinon.spy(element, 'validate');
      element.pattern = '[-+\\d]';
      expect(spy.calledOnce).to.be.true;
    });

    it('should call checkValidity on the input when invalid after minlength is changed', () => {
      element.invalid = true;
      const spy = sinon.spy(input, 'checkValidity');
      element.minlength = 2;
      expect(spy.calledOnce).to.be.true;
    });

    it('should call checkValidity on the input when invalid after maxlength is changed', () => {
      element.invalid = true;
      const spy = sinon.spy(input, 'checkValidity');
      element.maxlength = 6;
      expect(spy.calledOnce).to.be.true;
    });

    it('should call checkValidity on the input when invalid after pattern is changed', () => {
      element.invalid = true;
      const spy = sinon.spy(input, 'checkValidity');
      element.pattern = '[-+\\d]';
      expect(spy.calledOnce).to.be.true;
    });

    it('should update invalid state when required is removed', () => {
      element.required = true;
      element.validate();
      expect(element.invalid).to.be.true;

      element.required = false;
      expect(element.invalid).to.be.false;
    });

    it('should update invalid state when pattern is removed', () => {
      input.value = '123foo';
      element.pattern = '\\d+';

      element.validate();
      expect(element.invalid).to.be.true;

      element.pattern = '';
      expect(element.invalid).to.be.false;
    });

    it('should update invalid state when a constraint is removed even if other constraints are active', () => {
      element.required = true;
      element.pattern = '\\d*';
      element.validate();
      expect(element.invalid).to.be.true;

      element.required = false;
      expect(element.invalid).to.be.false;
    });

    it('should override explicitly set invalid when required is set', () => {
      element.invalid = true;
      element.value = 'foo';

      element.required = true;
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
      const field = document.createElement('input-constraints-mixin-element');
      expect(field.checkValidity()).to.be.true;
    });

    it('should return false when called before connected to the DOM and invalid', () => {
      const field = document.createElement('input-constraints-mixin-element');
      field.invalid = true;
      expect(field.checkValidity()).to.be.false;
    });
  });
});
