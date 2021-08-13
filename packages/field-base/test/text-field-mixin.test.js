import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { TextFieldMixin } from '../src/text-field-mixin.js';

customElements.define(
  'text-field-mixin-element',
  class extends TextFieldMixin(PolymerElement) {
    static get template() {
      return html`
        <slot name="label"></slot>
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

describe('text-field-mixin', () => {
  let element, input;

  beforeEach(() => {
    element = fixtureSync('<text-field-mixin-element></text-field-mixin-element>');
    input = element.querySelector('[slot=input]');
  });

  describe('properties', () => {
    it('should propagate pattern property to the input', () => {
      element.pattern = '[-+\\d]';
      expect(input.pattern).to.equal('[-+\\d]');
    });

    it('should propagate maxlength property to the input', () => {
      element.maxlength = 8;
      expect(input.maxLength).to.equal(8);
    });

    it('should propagate minlength property to the input', () => {
      element.minlength = 8;
      expect(input.minLength).to.equal(8);
    });
  });

  describe('validation', () => {
    it('should not change invalid property if no constraints are set', () => {
      element.validate();
      expect(element.invalid).to.be.false;
      element.invalid = true;
      element.validate();
      expect(element.invalid).to.be.true;
    });

    it('should not validate the field when required is set', () => {
      element.required = true;
      expect(element.invalid).to.be.false;
    });

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

    it('should validate the field when invalid and required is set', () => {
      element.invalid = true;
      const spy = sinon.spy(element, 'validate');
      element.required = true;
      expect(spy.calledOnce).to.be.true;
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

    it('should validate the field when invalid after pattern is changed', () => {
      element.invalid = true;
      const spy = sinon.spy(element, 'validate');
      element.pattern = '[-+\\d]';
      expect(spy.calledOnce).to.be.true;
    });

    it('should override explicitly set invalid if constraints are set', () => {
      element.invalid = true;
      element.value = 'foo';
      element.required = true;
      expect(element.invalid).to.be.false;
    });

    it('should update invalid state when required is removed', () => {
      element.required = true;
      element.validate();
      expect(element.invalid).to.be.true;

      element.required = false;
      expect(element.invalid).to.be.false;
    });

    it('should update invalid state when pattern is removed', () => {
      element.value = '123foo';
      element.pattern = '\\d+';
      element.validate();
      expect(element.invalid).to.be.true;

      element.pattern = '';
      expect(element.invalid).to.be.false;
    });
  });

  describe('prevent invalid input', () => {
    beforeEach(() => {
      element.preventInvalidInput = true;
      element.value = '1';
    });

    describe('user action', () => {
      function inputText(value) {
        input.value = value;
        input.dispatchEvent(new CustomEvent('input'));
      }

      it('should prevent invalid pattern', () => {
        element.pattern = '[0-9]*';
        inputText('f');
        expect(element.value).to.equal('1');
      });

      it('should not prevent valid pattern', () => {
        element.pattern = '[0-9]*';
        inputText('2');
        expect(element.value).to.equal('2');
      });

      it('should not prevent too short value', () => {
        element.minlength = 1;
        inputText('');
        expect(element.value).to.equal('');
      });

      it('should not prevent empty value for required field', () => {
        element.required = true;
        inputText('');
        expect(element.value).to.equal('');
      });
    });

    describe('programmatic', () => {
      it('should not prevent invalid pattern', () => {
        element.pattern = '[0-9]*';
        element.value = 'foo';
        expect(element.value).to.equal('foo');
      });

      it('should not prevent valid pattern', () => {
        element.pattern = '[0-9]*';
        element.value = '2';
        expect(element.value).to.equal('2');
      });

      it('should not prevent too short value', () => {
        element.minlength = 1;
        element.value = '';
        expect(element.value).to.equal('');
      });

      it('should not prevent empty value for required field', () => {
        element.required = true;
        element.value = '';
        expect(element.value).to.equal('');
      });
    });
  });
});
