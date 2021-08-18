import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { InputFieldMixin } from '../src/input-field-mixin.js';
import { InputSlotMixin } from '../src/input-slot-mixin.js';

customElements.define(
  'input-field-mixin-element',
  class extends InputFieldMixin(InputSlotMixin(PolymerElement)) {
    static get template() {
      return html`
        <style>
          :host {
            display: block;
          }

          /* Mimic Lumo styles to test resize */
          [part='error-message'] {
            max-height: 5em;
          }

          :host(:not([invalid])) [part='error-message'] {
            max-height: 0;
            overflow: hidden;
          }
        </style>
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
  }
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

    it('should select the input content when autoselect is set', () => {
      const spy = sinon.spy(input, 'select');
      element.autoselect = true;
      input.focus();
      expect(spy.calledOnce).to.be.true;
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

  describe('checkValidity', () => {
    it('should return true when called before connected to the DOM', () => {
      const field = document.createElement('input-field-mixin-element');
      expect(field.checkValidity()).to.be.true;
    });

    it('should return false when called before connected to the DOM and invalid', () => {
      const field = document.createElement('input-field-mixin-element');
      field.invalid = true;
      expect(field.checkValidity()).to.be.false;
    });
  });

  describe('iron-resize', () => {
    let spy;

    function flushTextField(textField) {
      textField.__observeOffsetHeightDebouncer.flush();
    }

    beforeEach(() => {
      element = fixtureSync('<input-field-mixin-element></input-field-mixin-element>');
      spy = sinon.spy();
      element.addEventListener('iron-resize', spy);
    });

    it('should not dispatch `iron-resize` event on init', () => {
      expect(spy.called).to.be.false;
    });

    it('should dispatch `iron-resize` event on invalid height change', () => {
      element.errorMessage = 'Error';
      flushTextField(element);
      element.invalid = true;
      flushTextField(element);
      expect(spy.called).to.be.true;
    });

    it('should be a composed event', () => {
      element.errorMessage = 'Error';
      flushTextField(element);
      element.invalid = true;
      flushTextField(element);
      const event = spy.lastCall.lastArg;
      expect(event.composed).to.be.true;
    });

    it('should dispatch `iron-resize` event on error message height change', () => {
      element.errorMessage = 'Error';
      flushTextField(element);
      element.invalid = true;
      flushTextField(element);
      spy.resetHistory();

      // Long message that spans on multiple lines
      element.errorMessage = [...new Array(42)].map(() => 'bla').join(' ');
      flushTextField(element);

      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch `iron-resize` event on label height change', () => {
      flushTextField(element);
      element.label = 'Label';
      flushTextField(element);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('slotted input value', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn when value is set on the slotted input', () => {
      element = fixtureSync(`
        <input-field-mixin-element>
          <input slot="input" value="foo">
        </input-field-mixin-element>
      `);
      expect(console.warn.called).to.be.true;
    });
  });

  describe('invalid', () => {
    beforeEach(() => {
      element = fixtureSync('<input-field-mixin-element value="foo" invalid></input-field-mixin-element>');
    });

    it('should not reset invalid state set with attribute', () => {
      expect(element.invalid).to.be.true;
    });
  });
});
