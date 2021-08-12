import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ForwardInputPropsMixin } from '../src/forward-input-props-mixin.js';
import { AriaLabelMixin } from '../src/aria-label-mixin.js';

customElements.define(
  'forward-input-props-mixin-element',
  class extends ForwardInputPropsMixin(AriaLabelMixin(PolymerElement)) {
    static get template() {
      return html`<slot name="label"></slot><slot name="input"></slot>`;
    }

    connectedCallback() {
      super.connectedCallback();

      this._setInputElement(this._inputNode);
    }
  }
);

describe('forward-input-props-mixin', () => {
  let element, input;

  describe('name', () => {
    beforeEach(() => {
      element = fixtureSync('<forward-input-props-mixin-element name="foo"></forward-input-props-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate name attribute to the input', () => {
      expect(input.name).to.equal('foo');
    });

    it('should propagate name property to the input', () => {
      element.name = 'bar';
      expect(input.name).to.equal('bar');
    });
  });

  describe('title', () => {
    beforeEach(() => {
      element = fixtureSync('<forward-input-props-mixin-element title="foo"></forward-input-props-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate title attribute to the input', () => {
      expect(input.title).to.equal('foo');
    });

    it('should propagate title property to the input', () => {
      element.title = 'bar';
      expect(input.title).to.equal('bar');
    });
  });

  describe('placeholder', () => {
    beforeEach(() => {
      element = fixtureSync(
        '<forward-input-props-mixin-element placeholder="foo"></forward-input-props-mixin-element>'
      );
      input = element.querySelector('[slot=input]');
    });

    it('should propagate placeholder attribute to the input', () => {
      expect(input.placeholder).to.equal('foo');
    });

    it('should propagate placeholder property to the input', () => {
      element.placeholder = 'bar';
      expect(input.placeholder).to.equal('bar');
    });
  });

  describe('readonly', () => {
    beforeEach(() => {
      element = fixtureSync('<forward-input-props-mixin-element readonly></forward-input-props-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate readonly attribute to the input', () => {
      expect(input.readOnly).to.be.true;
    });

    it('should propagate readonly property to the input', () => {
      element.readonly = false;
      expect(input.readOnly).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(() => {
      element = fixtureSync('<forward-input-props-mixin-element required></forward-input-props-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate required attribute to the input', () => {
      expect(input.required).to.be.true;
    });

    it('should propagate required property to the input', () => {
      element.required = false;
      expect(input.required).to.be.false;
    });
  });

  describe('invalid', () => {
    beforeEach(() => {
      element = fixtureSync('<forward-input-props-mixin-element invalid></forward-input-props-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should set invalid attribute on the input', () => {
      expect(input.hasAttribute('invalid')).to.be.true;
    });

    it('should set aria-invalid attribute on the input', () => {
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });

    it('should remove invalid attribute when valid', () => {
      element.invalid = false;
      expect(input.hasAttribute('invalid')).to.be.false;
    });

    it('should remove aria-invalid attribute when valid', () => {
      element.invalid = false;
      expect(input.hasAttribute('aria-invalid')).to.be.false;
    });
  });
});
