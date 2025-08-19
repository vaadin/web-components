import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { definePolymer, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { InputController } from '../src/input-controller.js';
import { InputMixin } from '../src/input-mixin.js';

describe('InputController', () => {
  const tag = definePolymer(
    'input-mixin',
    `<slot name="input"></slot>`,
    (Base) => class extends InputMixin(ControllerMixin(Base)) {},
  );

  describe('default', () => {
    let element, controller, input;

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
      controller = new InputController(element, (node) => {
        element._setInputElement(node);
      });
      element.addController(controller);
      input = element.querySelector('[slot=input]');
    });

    it('should create an input element', () => {
      expect(input).to.be.an.instanceof(HTMLInputElement);
    });

    it('should store a reference as inputElement', () => {
      expect(element.inputElement).to.equal(input);
    });

    it('should have an empty name by default', () => {
      expect(input.name).to.equal('');
    });

    it('should have an empty value by default', () => {
      expect(input.value).to.equal('');
    });
  });

  describe('value attribute', () => {
    let element, input;

    beforeEach(() => {
      element = fixtureSync(`<${tag} value="foo"></${tag}>`);
    });

    it('should forward value attribute to the input', () => {
      element.addController(new InputController(element));
      input = element.querySelector('[slot=input]');
      expect(input.value).to.equal('foo');
    });
  });

  describe('value property', () => {
    let element, input;

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
      element.value = 'foo';
    });

    it('should forward value property to the input', () => {
      element.addController(new InputController(element));
      input = element.querySelector('[slot=input]');
      expect(input.value).to.equal('foo');
    });

    it('should dispatch change event when clearing input', async () => {
      element.addController(new InputController(element));
      input = element.querySelector('[slot=input]');

      const spy = sinon.spy();
      input.addEventListener('change', spy);

      input.focus();
      input.select();
      await sendKeys({ press: 'Backspace' });
      input.blur();

      expect(spy).to.be.calledOnce;
    });
  });

  describe('type property', () => {
    let element, input;

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
    });

    it('should set input type based on the property', () => {
      element._setType('number');
      element.addController(new InputController(element));
      input = element.querySelector('[slot=input]');
      expect(input.type).to.equal('number');
    });
  });

  describe('unique id', () => {
    let wrapper, elements;

    const ID_REGEX = new RegExp(`^input-${tag}-\\d+$`, 'u');

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <${tag}></${tag}>
          <${tag}></${tag}>
        </div>
      `);
      elements = wrapper.children;
      elements[0].addController(new InputController(elements[0]));
      elements[1].addController(new InputController(elements[1]));
    });

    it('should set unique ID attribute on each textarea', () => {
      const input1 = elements[0].querySelector('[slot=input]');
      const input2 = elements[1].querySelector('[slot=input]');
      expect(input1.id).to.match(ID_REGEX);
      expect(input2.id).to.match(ID_REGEX);
      expect(input1.id).to.not.equal(input2.id);
    });
  });
});
