import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { InputMixin } from '../src/input-mixin.js';
import { InputSlotMixin } from '../src/input-slot-mixin.js';

describe('input-mixin', () => {
  let element, input, inputSpy, changeSpy;

  before(() => {
    inputSpy = sinon.spy();
    changeSpy = sinon.spy();

    customElements.define(
      'input-mixin-element',
      class extends InputMixin(InputSlotMixin(PolymerElement)) {
        static get template() {
          return html`<slot name="input"></slot>`;
        }

        connectedCallback() {
          super.connectedCallback();

          this._setInputElement(this._inputNode);
        }

        _onInput() {
          inputSpy();
        }

        _onChange() {
          changeSpy();
        }
      }
    );
  });

  beforeEach(() => {
    element = fixtureSync('<input-mixin-element></input-mixin-element>');
    input = element.querySelector('[slot=input]');
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
