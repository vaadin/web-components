import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { InputController } from '../src/input-controller.js';
import { InputMixin } from '../src/input-mixin.js';

customElements.define(
  'input-controller-element',
  class extends InputMixin(ControllerMixin(PolymerElement)) {
    static get template() {
      return html`<slot name="input"></slot>`;
    }
  },
);

describe('input-controller', () => {
  describe('default', () => {
    let element, controller, input;

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

    it('should have an empty name by default', () => {
      expect(input.name).to.equal('');
    });

    it('should have an empty value by default', () => {
      expect(input.value).to.equal('');
    });
  });

  describe('value attribute', () => {
    let element, input;

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
    let element, input;

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
    let element, input;

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

  describe('unique id', () => {
    let wrapper, elements;

    const ID_REGEX = /^input-controller-element-\d+$/;

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <input-controller-element></input-controller-element>
          <input-controller-element></input-controller-element>
        </div>
      `);
      elements = wrapper.children;
      elements[0].addController(new InputController(elements[0]));
      elements[1].addController(new InputController(elements[1]));
    });

    it('should set unique ID attribute on each textarea', () => {
      const input1 = elements[0].querySelector('[slot=input]');
      const input2 = elements[1].querySelector('[slot=input]');
      expect(input1.id).to.match(ID_REGEX);
      expect(input2.id).to.match(ID_REGEX);
      expect(input1.id).to.not.equal(input2.id);
    });
  });
});
