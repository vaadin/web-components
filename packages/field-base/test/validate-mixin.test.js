import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ValidateMixin } from '../src/validate-mixin.js';

customElements.define(
  'validate-mixin-element',
  class extends ValidateMixin(PolymerElement) {
    static get template() {
      return html`<input />`;
    }
  },
);

describe('validate-mixin', () => {
  let element;

  describe('checkValidity', () => {
    beforeEach(() => {
      element = fixtureSync(`<validate-mixin-element></validate-mixin-element>`);
    });

    it('should return true when element is not required', () => {
      expect(element.checkValidity()).to.be.true;
    });

    it('should return false when element is required and value is not set', () => {
      element.required = true;
      expect(element.checkValidity()).to.be.false;
    });

    it('should return true when element is required and value is set', () => {
      element.required = true;
      element.value = 'value';
      expect(element.checkValidity()).to.be.true;
    });
  });

  describe('validate', () => {
    beforeEach(() => {
      element = fixtureSync(`<validate-mixin-element></validate-mixin-element>`);
    });

    it('should return true when element is not required', () => {
      expect(element.validate()).to.be.true;
    });

    it('should return false when element is required and value is not set', () => {
      element.required = true;
      expect(element.validate()).to.be.false;
    });

    it('should return true when element is required and value is set', () => {
      element.required = true;
      element.value = 'value';
      expect(element.validate()).to.be.true;
    });

    it('should not set invalid to true when element is not required', () => {
      element.validate();
      expect(element.invalid).to.be.false;
    });

    it('should set invalid when element is required and value is not set', () => {
      element.required = true;
      element.validate();
      expect(element.invalid).to.be.true;
    });

    it('should not set invalid to true when element is required and value is set', () => {
      element.required = true;
      element.value = 'value';
      element.validate();
      expect(element.invalid).to.be.false;
    });

    it('should set invalid back to false after value is set on the element', () => {
      element.required = true;
      element.validate();

      element.value = 'value';
      element.validate();
      expect(element.invalid).to.be.false;
    });
  });
});
