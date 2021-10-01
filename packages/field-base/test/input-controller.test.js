import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { InputController } from '../src/input-controller.js';
import { InputMixin } from '../src/input-mixin.js';

customElements.define(
  'input-controller-element',
  class extends InputMixin(ElementMixin(PolymerElement)) {
    static get template() {
      return html`<slot name="input"></slot>`;
    }
  }
);

describe('input-controller', () => {
  let element, controller, input;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync('<input-controller-element></input-controller-element>');
      controller = new InputController(element, (node) => {
        element._setInputElement(node);
      });
      element.addController(controller);
      input = element.querySelector('[slot=input]');
    });

    it('should create an input element', () => {
      expect(input).to.be.an.instanceof(HTMLInputElement);
    });

    it('should store a reference as inputElement', () => {
      expect(element.inputElement).to.equal(input);
    });

    it('should set id attribute on the input', () => {
      const ID_REGEX = /^input-controller-element-\d+$/;
      const id = input.getAttribute('id');
      expect(id).to.match(ID_REGEX);
      expect(id.endsWith(controller.constructor._uniqueInputId)).to.be.true;
    });

    it('should have an empty name by default', () => {
      expect(input.name).to.equal('');
    });

    it('should have an empty value by default', () => {
      expect(input.value).to.equal('');
    });
  });

  describe('value attribute', () => {
    beforeEach(() => {
      element = fixtureSync('<input-controller-element value="foo"></input-controller-element>');
    });

    it('should forward value attribute to the input', () => {
      element.addController(new InputController(element));
      input = element.querySelector('[slot=input]');
      expect(input.value).to.equal('foo');
    });
  });

  describe('value property', () => {
    beforeEach(() => {
      element = fixtureSync('<input-controller-element></input-controller-element>');
      element.value = 'foo';
    });

    it('should forward value property to the input', () => {
      element.addController(new InputController(element));
      input = element.querySelector('[slot=input]');
      expect(input.value).to.equal('foo');
    });
  });

  describe('type property', () => {
    beforeEach(() => {
      element = fixtureSync('<input-controller-element value="foo"></input-controller-element>');
    });

    it('should set input type based on the property', () => {
      element._setType('number');
      element.addController(new InputController(element));
      input = element.querySelector('[slot=input]');
      expect(input.type).to.equal('number');
    });
  });
});
