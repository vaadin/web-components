import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { InputController } from '../src/input-controller.js';
import { InputFieldMixin } from '../src/input-field-mixin.js';

customElements.define(
  'input-field-mixin-element',
  class extends InputFieldMixin(PolymerElement) {
    static get template() {
      return html`
        <div part="label">
          <slot name="label"></slot>
        </div>
        <slot name="input"></slot>
        <button id="clearButton">Clear</button>
        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
        <slot name="helper"></slot>
      `;
    }

    get clearElement() {
      return this.$.clearButton;
    }

    constructor() {
      super();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        }),
      );
    }
  },
);

describe('input-field-mixin', () => {
  let element, input;

  describe('properties', () => {
    beforeEach(() => {
      element = fixtureSync('<input-field-mixin-element></input-field-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate autocomplete property to the input', () => {
      element.autocomplete = 'on';
      expect(input.autocomplete).to.equal('on');
    });

    it('should propagate autocorrect property to the input', () => {
      element.autocorrect = 'on';
      expect(input.getAttribute('autocorrect')).to.equal('on');
    });

    it('should propagate autocapitalize property to the input', () => {
      element.autocapitalize = 'none';
      expect(input.getAttribute('autocapitalize')).to.equal('none');
    });
  });

  describe('validation', () => {
    beforeEach(() => {
      element = fixtureSync('<input-field-mixin-element></input-field-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should validate on input blur', () => {
      const spy = sinon.spy(element, 'validate');
      input.dispatchEvent(new Event('blur'));
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate on input event', async () => {
      const spy = sinon.spy(element, 'validate');
      element.required = true;
      element.invalid = true;
      input.focus();
      await sendKeys({ type: 'f' });
      expect(spy.calledOnce).to.be.true;
      expect(element.invalid).to.be.false;
    });

    it('should validate on value change when field is invalid', () => {
      const spy = sinon.spy(element, 'validate');
      element.invalid = true;
      element.value = 'foo';
      expect(spy.calledOnce).to.be.true;
    });

    it('should call checkValidity on the input when required', () => {
      const spy = sinon.spy(input, 'checkValidity');
      element.required = true;
      element.checkValidity();
      expect(spy.calledOnce).to.be.true;
    });

    it('should not call checkValidity on the input when not required', () => {
      const spy = sinon.spy(input, 'checkValidity');
      element.checkValidity();
      expect(spy.calledOnce).to.be.false;
    });
  });

  describe('slotted input value', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
      element = document.createElement('input-field-mixin-element');
    });

    afterEach(() => {
      document.body.removeChild(element);
      console.warn.restore();
    });

    it('should warn when value is set on the slotted input', () => {
      input = document.createElement('input');
      input.setAttribute('slot', 'input');
      input.value = 'foo';
      element.appendChild(input);
      document.body.appendChild(element);
      expect(console.warn.called).to.be.true;
    });

    it('should not warn when value is set on the element itself', () => {
      element.value = 'foo';
      document.body.appendChild(element);
      expect(console.warn.called).to.be.false;
    });
  });
});
