import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { TextAreaController } from '../src/text-area-controller.js';
import { InputMixin } from '../src/input-mixin.js';

customElements.define(
  'textarea-controller-element',
  class extends InputMixin(ElementMixin(PolymerElement)) {
    static get template() {
      return html`<slot name="textarea"></slot>`;
    }
  }
);

describe('text-area-controller', () => {
  let element, controller, textarea;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync('<textarea-controller-element></textarea-controller-element>');
      controller = new TextAreaController(element, (node) => {
        element._setInputElement(node);
      });
      element.addController(controller);
      textarea = element.querySelector('[slot=textarea]');
    });

    it('should create a textarea element', () => {
      expect(textarea).to.be.an.instanceof(HTMLTextAreaElement);
    });

    it('should store a reference as inputElement', () => {
      expect(element.inputElement).to.equal(textarea);
    });

    it('should set id attribute on the textarea', () => {
      const ID_REGEX = /^textarea-controller-element-\d+$/;
      const id = textarea.getAttribute('id');
      expect(id).to.match(ID_REGEX);
      expect(id.endsWith(controller.constructor._uniqueTextAreaId)).to.be.true;
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
      element = fixtureSync('<textarea-controller-element name="foo"></textarea-controller-element>');
    });

    it('should forward name attribute to the textarea', () => {
      element.addController(new TextAreaController(element));
      textarea = element.querySelector('[slot=textarea]');
      expect(textarea.name).to.equal('foo');
    });
  });

  describe('value', () => {
    beforeEach(() => {
      element = fixtureSync('<textarea-controller-element value="foo"></textarea-controller-element>');
    });

    it('should forward value attribute to the textarea', () => {
      element.addController(new TextAreaController(element));
      textarea = element.querySelector('[slot=textarea]');
      expect(textarea.value).to.equal('foo');
    });
  });
});
