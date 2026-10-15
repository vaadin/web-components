import { expect } from '@vaadin/chai-plugins';
import { defineLit, fixtureSync } from '@vaadin/testing-helpers';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { InputMixin } from '../src/input-mixin.js';
import { TextAreaController } from '../src/text-area-controller.js';

describe('TextAreaController', () => {
  const tag = defineLit(
    'input-mixin',
    `<slot name="textarea"></slot>`,
    (Base) => class extends InputMixin(PolylitMixin(Base)) {},
  );

  describe('default', () => {
    let element, controller, textarea;

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
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
      element = fixtureSync(`<${tag} name="foo"></${tag}>`);
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
      element = fixtureSync(`<${tag} value="foo"></${tag}>`);
    });

    it('should forward value attribute to the textarea', () => {
      element.addController(new TextAreaController(element));
      textarea = element.querySelector('[slot=textarea]');
      expect(textarea.value).to.equal('foo');
    });
  });

  describe('unique id', () => {
    let wrapper, elements;

    const ID_REGEX = new RegExp(`^textarea-${tag}-\\d+$`, 'u');

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <${tag}></${tag}>
          <${tag}></${tag}>
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
