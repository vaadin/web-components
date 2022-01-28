import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html as legacyHtml, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, LitElement } from 'lit';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ValidateMixin } from '../src/validate-mixin.js';

customElements.define(
  'validate-mixin-polymer-element',
  class extends ValidateMixin(PolymerElement) {
    static get template() {
      return legacyHtml`<input />`;
    }
  }
);

customElements.define(
  'validate-mixin-lit-element',
  class extends ValidateMixin(PolylitMixin(LitElement)) {
    render() {
      return html`<input />`;
    }
  },
);

const runTests = (baseClass) => {
  const tag = `validate-mixin-${baseClass}-element`;

  const updateComplete = () => (baseClass === 'lit' ? element.updateComplete : Promise.resolve());

  let element;

  describe('properties', () => {
    beforeEach(() => {
      element = fixtureSync(`<${tag}></$${tag}>`);
    });

    it('should reflect required property to attribute', async () => {
      expect(element.hasAttribute('required')).to.be.false;

      element.required = true;
      await updateComplete();
      expect(element.hasAttribute('required')).to.be.true;
    });

    it('should reflect invalid property to attribute', async () => {
      expect(element.hasAttribute('invalid')).to.be.false;

      element.invalid = true;
      await updateComplete();
      expect(element.hasAttribute('invalid')).to.be.true;
    });
  });

  describe('checkValidity', () => {
    beforeEach(() => {
      element = fixtureSync(`<${tag}></$${tag}>`);
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
      element = fixtureSync(`<${tag}></${tag}>`);
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
};

describe('ValidateMixin + Polymer', () => {
  runTests('polymer');
});

describe('ValidateMixin + Lit', () => {
  runTests('lit');
});
