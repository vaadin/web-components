import { expect } from '@esm-bundle/chai';
import { fixtureSync, fire } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { CheckedMixin } from '../src/checked-mixin.js';
import { InputSlotMixin } from '../src/input-slot-mixin.js';

customElements.define(
  'checked-mixin-element',
  class extends CheckedMixin(InputSlotMixin(PolymerElement)) {
    static get template() {
      return html`<div>
        <slot></slot>
        <slot name="input"></slot>
      </div>`;
    }

    constructor() {
      super();

      this._setType('checkbox');
    }
  }
);

describe('checked-mixin', () => {
  let element, input, link;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <checked-mixin-element>
          I accept <a href="#">the terms and conditions</a>
        </checked-mixin-element>
      `);

      link = element.querySelector('a');
      input = element.querySelector('[slot=input]');
    });

    it('should set checked property to false by default', () => {
      expect(element.checked).to.be.false;
    });

    it('should not have checked attribute by default', () => {
      expect(element.hasAttribute('checked')).to.be.false;
    });

    it('should reflect checked property to the attribute', () => {
      element.checked = true;
      expect(element.hasAttribute('checked')).to.be.true;

      element.checked = false;
      expect(element.hasAttribute('checked')).to.be.false;
    });

    it('should toggle checked property on change', () => {
      input.checked = true;
      fire(input, 'change');
      expect(element.checked).to.be.true;

      input.checked = false;
      fire(input, 'change');
      expect(element.checked).to.be.false;
    });

    it('should toggle checked property on click', () => {
      input.click();
      expect(element.checked).to.be.true;

      input.click();
      expect(element.checked).to.be.false;
    });

    it('should not toggle checked property when clicked a link', () => {
      link.click();
      expect(element.checked).to.be.false;
    });

    it('should not toggle checked property when disabled', () => {
      element.disabled = true;
      input.click();
      expect(element.checked).to.be.false;
    });
  });

  describe('delegation', () => {
    describe('checked property', () => {
      beforeEach(() => {
        element = fixtureSync(`<checked-mixin-element checked></checked-mixin-element>`);
        input = element.querySelector('[slot=input]');
      });

      it('should delegate checked property to the input', () => {
        expect(input.checked).to.be.true;

        element.checked = false;
        expect(input.checked).to.be.false;
      });
    });
  });
});
