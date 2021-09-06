import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { InputSlotMixin } from '../src/input-slot-mixin.js';

customElements.define(
  'input-slot-mixin-element',
  class extends InputSlotMixin(PolymerElement) {
    static get template() {
      return html`<slot name="input"></slot>`;
    }
  }
);

customElements.define(
  'input-slot-mixin-number-element',
  class extends InputSlotMixin(PolymerElement) {
    static get template() {
      return html`<slot name="input"></slot>`;
    }

    constructor() {
      super();

      // Set readOnly property
      this._setType('number');
    }
  }
);

describe('input-slot-mixin', () => {
  let element, input;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync('<input-slot-mixin-element></input-slot-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should create an input element', () => {
      expect(input).to.be.an.instanceof(HTMLInputElement);
    });

    it('should store a reference as inputElement', () => {
      expect(element.inputElement).to.equal(input);
    });

    it('should set id attribute on the input', () => {
      const idRegex = /^input-slot-mixin-element-\d$/;
      expect(input.getAttribute('id')).to.match(idRegex);
    });

    it('should have a read-only type property', () => {
      expect(element.type).to.be.undefined;
      element.type = 'number';
      expect(element.type).to.be.undefined;
    });

    it('should have an empty name by default', () => {
      expect(input.name).to.equal('');
    });

    it('should have an empty value by default', () => {
      expect(input.value).to.equal('');
    });
  });

  describe('name', () => {
    beforeEach(() => {
      element = fixtureSync('<input-slot-mixin-element name="foo"></input-slot-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should forward name attribute to the input', () => {
      expect(input.name).to.equal('foo');
    });
  });

  describe('value', () => {
    beforeEach(() => {
      element = fixtureSync('<input-slot-mixin-element value="foo"></input-slot-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should forward value attribute to the input', () => {
      expect(input.value).to.equal('foo');
    });
  });

  describe('type', () => {
    beforeEach(() => {
      element = fixtureSync('<input-slot-mixin-number-element value="foo"></input-slot-mixin-number-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should set input type based on the property', () => {
      expect(input.type).to.equal('number');
    });
  });
});
