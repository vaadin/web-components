import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { InputController } from '../src/input-controller.js';
import { PatternMixin } from '../src/pattern-mixin.js';

customElements.define(
  'pattern-mixin-element',
  class extends PatternMixin(ControllerMixin(PolymerElement)) {
    static get template() {
      return html`<slot name="label"></slot><slot name="input"></slot>`;
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

describe('pattern-mixin', () => {
  let element, input;

  beforeEach(() => {
    element = fixtureSync('<pattern-mixin-element></pattern-mixin-element>');
    input = element.querySelector('[slot=input]');
  });

  describe('pattern', () => {
    it('should propagate pattern property to the input', () => {
      element.pattern = '[-+\\d]';
      expect(input.pattern).to.equal('[-+\\d]');
    });

    it('should not validate the field when pattern is set', () => {
      element.pattern = '[-+\\d]';
      expect(element.invalid).to.be.false;
    });

    it('should validate the field when invalid after pattern is changed', () => {
      element.invalid = true;
      const spy = sinon.spy(element, 'validate');
      element.pattern = '[-+\\d]';
      expect(spy.calledOnce).to.be.true;
    });

    it('should update invalid state when pattern is removed', () => {
      input.value = '123foo';
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

    function inputText(value) {
      input.value = value;
      input.dispatchEvent(new CustomEvent('input'));
    }

    it('should prevent invalid pattern', () => {
      element.pattern = '[0-9]*';
      inputText('f');
      expect(element.value).to.equal('1');
    });

    it('should temporarily set input-prevented attribute on invalid input', () => {
      element.pattern = '[0-9]*';
      inputText('f');
      expect(element.hasAttribute('input-prevented')).to.be.true;
    });

    it('should not set input-prevented attribute on valid input', () => {
      element.pattern = '[0-9]*';
      inputText('1');
      expect(element.hasAttribute('input-prevented')).to.be.false;
    });

    it('should remove input-prevented attribute after 200ms timeout', () => {
      const clock = sinon.useFakeTimers();
      element.pattern = '[0-9]*';
      inputText('f');
      clock.tick(200);
      expect(element.hasAttribute('input-prevented')).to.be.false;
      clock.restore();
    });

    it('should prevent entering invalid characters', () => {
      element.value = '';
      element.pattern = '[0-9]*';
      inputText('f');
      expect(input.value).to.equal('');
    });

    it('should not fire value-changed event when prevented', () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      element.pattern = '[0-9]*';
      inputText('f');
      expect(spy.called).to.be.false;
    });

    it('should not prevent valid pattern', () => {
      element.pattern = '[0-9]*';
      inputText('2');
      expect(input.value).to.equal('2');
    });

    it('should not prevent too short value', () => {
      input.minlength = 1;
      inputText('');
      expect(input.value).to.equal('');
    });

    it('should not prevent empty value for required field', () => {
      element.required = true;
      inputText('');
      expect(input.value).to.equal('');
    });
  });
});
