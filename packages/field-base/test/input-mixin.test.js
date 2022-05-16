import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { InputMixin } from '../src/input-mixin.js';

customElements.define(
  'input-mixin-element',
  class extends InputMixin(PolymerElement) {
    static get template() {
      return html`<slot name="input"></slot>`;
    }
  },
);

describe('input-mixin', () => {
  let element, input, inputSpy, changeSpy;

  describe('type', () => {
    beforeEach(() => {
      element = fixtureSync('<input-mixin-element></input-mixin-element>');
    });

    it('should have a read-only type property', () => {
      expect(element.type).to.be.undefined;
      element.type = 'number';
      expect(element.type).to.be.undefined;
    });
  });

  describe('value', () => {
    beforeEach(() => {
      element = fixtureSync('<input-mixin-element></input-mixin-element>');
      input = document.createElement('input');
      input.setAttribute('slot', 'input');
      element.appendChild(input);
      element._setInputElement(input);
    });

    it('should set property to empty string by default', () => {
      expect(element.value).to.be.equal('');
    });

    it('should not set has-value attribute by default', () => {
      expect(element.hasAttribute('has-value')).to.be.false;
    });

    it('should set has-value attribute when value attribute is set', () => {
      element.setAttribute('value', 'test');
      expect(element.hasAttribute('has-value')).to.be.true;
    });

    it('should set has-value attribute when value property is set', () => {
      element.value = 'test';
      expect(element.hasAttribute('has-value')).to.be.true;
    });

    it('should remove has-value attribute when value is removed', () => {
      element.value = 'foo';
      element.value = '';
      expect(element.hasAttribute('has-value')).to.be.false;
    });

    it('should propagate value to the input element', () => {
      element.value = 'foo';
      expect(input.value).to.equal('foo');
    });

    it('should clear input value when value is set to null', () => {
      element.value = 'foo';
      element.value = null;
      expect(input.value).to.equal('');
    });

    it('should clear input value when value is set to undefined', () => {
      element.value = 'foo';
      element.value = undefined;
      expect(input.value).to.equal('');
    });

    it('should update field value on the input event', () => {
      input.value = 'foo';
      input.dispatchEvent(new Event('input'));
      expect(element.value).to.equal('foo');
    });

    it('should clear the field value on clear method call', () => {
      element.clear();
      expect(element.value).to.equal('');
    });

    it('should clear the input value on clear method call', () => {
      element.clear();
      expect(input.value).to.equal('');
    });
  });

  describe('events', () => {
    before(() => {
      inputSpy = sinon.spy();
      changeSpy = sinon.spy();

      customElements.define(
        'input-mixin-events-element',
        class extends InputMixin(PolymerElement) {
          static get template() {
            return html`<slot name="input"></slot>`;
          }

          _onInput() {
            inputSpy();
          }

          _onChange() {
            changeSpy();
          }
        },
      );
    });

    beforeEach(() => {
      element = fixtureSync('<input-mixin-events-element></input-mixin-events-element>');
      input = document.createElement('input');
      element.appendChild(input);
      element._setInputElement(input);
    });

    afterEach(() => {
      inputSpy.resetHistory();
      changeSpy.resetHistory();
    });

    it('should call an input event listener', () => {
      input.dispatchEvent(new CustomEvent('input'));
      expect(inputSpy.calledOnce).to.be.true;
    });

    it('should call a change event listener', () => {
      input.dispatchEvent(new CustomEvent('change'));
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should not call an input event listener when input is unset', () => {
      element.removeChild(input);
      element._setInputElement(undefined);
      input.dispatchEvent(new CustomEvent('input'));
      expect(inputSpy.called).to.be.false;
    });

    it('should not call a change event listener when input is unset', () => {
      element.removeChild(input);
      element._setInputElement(undefined);
      input.dispatchEvent(new CustomEvent('change'));
      expect(changeSpy.called).to.be.false;
    });
  });
});
