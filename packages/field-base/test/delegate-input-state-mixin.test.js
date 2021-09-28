import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { DelegateInputStateMixin } from '../src/delegate-input-state-mixin.js';
import { InputController } from '../src/input-controller.js';

customElements.define(
  'delegate-input-state-mixin-element',
  class extends DelegateInputStateMixin(ElementMixin(PolymerElement)) {
    static get template() {
      return html`<slot name="input"></slot>`;
    }

    ready() {
      super.ready();

      this.addController(new InputController(this));
    }
  }
);

describe('delegate-input-state-mixin', () => {
  let element, input;

  describe('name', () => {
    beforeEach(() => {
      element = fixtureSync('<delegate-input-state-mixin-element name="foo"></delegate-input-state-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate name attribute to the input', () => {
      expect(input.getAttribute('name')).to.equal('foo');
    });

    it('should propagate name property to the input', () => {
      element.name = 'bar';
      expect(input.getAttribute('name')).to.equal('bar');
    });
  });

  describe('title', () => {
    beforeEach(() => {
      element = fixtureSync('<delegate-input-state-mixin-element title="foo"></delegate-input-state-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate title attribute to the input', () => {
      expect(input.getAttribute('title')).to.equal('foo');
    });

    it('should propagate title property to the input', () => {
      element.title = 'bar';
      expect(input.getAttribute('title')).to.equal('bar');
    });
  });

  describe('placeholder', () => {
    beforeEach(() => {
      element = fixtureSync(
        '<delegate-input-state-mixin-element placeholder="foo"></delegate-input-state-mixin-element>'
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
      element = fixtureSync('<delegate-input-state-mixin-element readonly></delegate-input-state-mixin-element>');
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
      element = fixtureSync('<delegate-input-state-mixin-element required></delegate-input-state-mixin-element>');
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
      element = fixtureSync('<delegate-input-state-mixin-element invalid></delegate-input-state-mixin-element>');
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
