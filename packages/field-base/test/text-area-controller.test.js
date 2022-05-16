import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { InputMixin } from '../src/input-mixin.js';
import { TextAreaController } from '../src/text-area-controller.js';

customElements.define(
  'textarea-controller-element',
  class extends InputMixin(ControllerMixin(PolymerElement)) {
    static get template() {
      return html`<slot name="textarea"></slot>`;
    }
  },
);

describe('text-area-controller', () => {
  describe('default', () => {
    let element, controller, textarea;

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

    it('should have an empty name by default', () => {
      expect(textarea.name).to.equal('');
    });

    it('should have an empty value by default', () => {
      expect(textarea.value).to.equal('');
    });
  });

  describe('name', () => {
    let element, textarea;

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
    let element, textarea;

    beforeEach(() => {
      element = fixtureSync('<textarea-controller-element value="foo"></textarea-controller-element>');
    });

    it('should forward value attribute to the textarea', () => {
      element.addController(new TextAreaController(element));
      textarea = element.querySelector('[slot=textarea]');
      expect(textarea.value).to.equal('foo');
    });
  });

  describe('unique id', () => {
    let wrapper, elements;

    const ID_REGEX = /^textarea-controller-element-\d+$/;

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <textarea-controller-element></textarea-controller-element>
          <textarea-controller-element></textarea-controller-element>
        </div>
      `);
      elements = wrapper.children;
      elements[0].addController(new TextAreaController(elements[0]));
      elements[1].addController(new TextAreaController(elements[1]));
    });

    it('should set unique ID attribute on each textarea', () => {
      const textarea1 = elements[0].querySelector('[slot=textarea]');
      const textarea2 = elements[1].querySelector('[slot=textarea]');
      expect(textarea1.id).to.match(ID_REGEX);
      expect(textarea2.id).to.match(ID_REGEX);
      expect(textarea1.id).to.not.equal(textarea2.id);
    });
  });
});
