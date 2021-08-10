import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { InputListenersMixin } from '../src/input-listeners-mixin.js';
import { InputMixin } from '../src/input-mixin.js';

describe('input-listeners-mixin', () => {
  let element, input, inputSpy, changeSpy;

  before(() => {
    inputSpy = sinon.spy();
    changeSpy = sinon.spy();

    customElements.define(
      'input-listeners-mixin-element',
      class extends InputListenersMixin(InputMixin(PolymerElement)) {
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
    element = fixtureSync('<input-listeners-mixin-element></input-listeners-mixin-element>');
    input = element.querySelector('[slot=input]');
  });

  it('should call an input event listener', () => {
    input.dispatchEvent(new CustomEvent('input'));
    expect(inputSpy.calledOnce).to.be.true;
  });

  it('should call a change event listener', () => {
    input.dispatchEvent(new CustomEvent('change'));
    expect(changeSpy.calledOnce).to.be.true;
  });
});
