import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { TextAreaSlotMixin } from '../src/text-area-slot-mixin.js';

customElements.define(
  'textarea-slot-mixin-element',
  class extends TextAreaSlotMixin(PolymerElement) {
    static get template() {
      return html`<slot name="textarea"></slot>`;
    }
  }
);

describe('text-area-slot-mixin', () => {
  let element, textarea;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync('<textarea-slot-mixin-element></textarea-slot-mixin-element>');
      textarea = element.querySelector('[slot=textarea]');
    });

    it('should create a textarea element', () => {
      expect(textarea).to.be.an.instanceof(HTMLTextAreaElement);
    });

    it('should store a reference as inputElement', () => {
      expect(element.inputElement).to.equal(textarea);
    });

    it('should set id attribute on the textarea', () => {
      const ID_REGEX = /^textarea-slot-mixin-element-\d$/;
      const id = textarea.getAttribute('id');
      expect(id).to.match(ID_REGEX);
      expect(id.endsWith(element.constructor._uniqueTextAreaId)).to.be.true;
    });

    it('should have an empty name by default', () => {
      expect(textarea.name).to.equal('');
    });

    it('should have an empty value by default', () => {
      expect(textarea.value).to.equal('');
    });
  });

  describe('name', () => {
    beforeEach(() => {
      element = fixtureSync('<textarea-slot-mixin-element name="foo"></textarea-slot-mixin-element>');
      textarea = element.querySelector('[slot=textarea]');
    });

    it('should forward name attribute to the textarea', () => {
      expect(textarea.name).to.equal('foo');
    });
  });

  describe('value', () => {
    beforeEach(() => {
      element = fixtureSync('<textarea-slot-mixin-element value="foo"></textarea-slot-mixin-element>');
      textarea = element.querySelector('[slot=textarea]');
    });

    it('should forward value attribute to the textarea', () => {
      expect(textarea.value).to.equal('foo');
    });
  });
});
