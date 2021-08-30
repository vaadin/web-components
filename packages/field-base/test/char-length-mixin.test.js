import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { CharLengthMixin } from '../src/char-length-mixin.js';
import { InputSlotMixin } from '../src/input-slot-mixin.js';

customElements.define(
  'char-length-mixin-element',
  class extends CharLengthMixin(InputSlotMixin(PolymerElement)) {
    static get template() {
      return html`
        <slot name="input"></slot>
        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
        <slot name="helper"></slot>
      `;
    }
  }
);

describe('char-length-mixin', () => {
  let element, input;

  beforeEach(() => {
    element = fixtureSync('<char-length-mixin-element></char-length-mixin-element>');
    input = element.querySelector('[slot=input]');
  });

  describe('properties', () => {
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
    it('should not validate the field when minlength is set', () => {
      element.minlength = 2;
      expect(element.invalid).to.be.false;
    });

    it('should not validate the field when maxlength is set', () => {
      element.maxlength = 6;
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
  });
});
