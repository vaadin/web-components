import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { defineLit, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { InputMixin } from '../src/input-mixin.js';

describe('InputMixin', () => {
  const tag = defineLit(
    'input-mixin',
    '<slot name="input"></slot>',
    (Base) => class extends InputMixin(PolylitMixin(Base)) {},
  );

  let element, input;

  describe('type', () => {
    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
    });

    it('should have a read-only type property', async () => {
      expect(element.type).to.be.undefined;

      element.type = 'number';
      await nextUpdate(element);

      expect(element.type).to.be.undefined;
    });
  });

  describe('value', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      input = document.createElement('input');
      input.setAttribute('slot', 'input');
      element.appendChild(input);
      element._setInputElement(input);
      await nextRender();
    });

    it('should set property to empty string by default', () => {
      expect(element.value).to.be.equal('');
    });

    it('should not set has-value attribute by default', () => {
      expect(element.hasAttribute('has-value')).to.be.false;
    });

    it('should set has-value attribute when value attribute is set', async () => {
      element.setAttribute('value', 'test');
      await nextUpdate(element);
      expect(element.hasAttribute('has-value')).to.be.true;
    });

    it('should set has-value attribute when value property is set', async () => {
      element.value = 'test';
      await nextUpdate(element);
      expect(element.hasAttribute('has-value')).to.be.true;
    });

    // User could accidentally set a 0 or false value
    it('should set has-value attribute when the value is a number', async () => {
      element.value = 0;
      await nextUpdate(element);
      expect(element.hasAttribute('has-value')).to.be.true;
    });

    it('should set has-value attribute when the value is a boolean', async () => {
      element.value = false;
      await nextUpdate(element);
      expect(element.hasAttribute('has-value')).to.be.true;
    });

    it('should remove has-value attribute when value is removed', async () => {
      element.value = 'foo';
      await nextUpdate(element);
      element.value = '';
      await nextUpdate(element);
      expect(element.hasAttribute('has-value')).to.be.false;
    });

    it('should propagate value to the input element', async () => {
      element.value = 'foo';
      await nextUpdate(element);
      expect(input.value).to.equal('foo');
    });

    it('should clear input value when value is set to null', async () => {
      element.value = 'foo';
      await nextUpdate(element);
      element.value = null;
      await nextUpdate(element);
      expect(input.value).to.equal('');
    });

    it('should clear input value when value is set to undefined', async () => {
      element.value = 'foo';
      await nextUpdate(element);
      element.value = undefined;
      await nextUpdate(element);
      expect(input.value).to.equal('');
    });

    it('should update field value on the input event', () => {
      input.value = 'foo';
      input.dispatchEvent(new Event('input'));
      expect(element.value).to.equal('foo');
    });

    it('should clear the field value on clear method call', async () => {
      element.value = 'foo';
      await nextUpdate(element);
      element.clear();
      await nextUpdate(element);
      expect(element.value).to.equal('');
    });

    it('should clear the input value on clear method call', async () => {
      element.value = 'foo';
      await nextUpdate(element);
      element.clear();
      await nextUpdate(element);
      expect(input.value).to.equal('');
    });
  });

  describe('events', () => {
    let eventsTag, inputSpy, changeSpy;

    before(() => {
      inputSpy = sinon.spy();
      changeSpy = sinon.spy();

      eventsTag = defineLit(
        'input-mixin-events',
        '<slot name="input"></slot>',
        (Base) =>
          class extends InputMixin(PolylitMixin(Base)) {
            _onInput() {
              inputSpy();
            }

            _onChange() {
              changeSpy();
            }
          },
      );
    });

    beforeEach(async () => {
      element = fixtureSync(`<${eventsTag}></${eventsTag}>`);
      await nextRender();
      input = document.createElement('input');
      element.appendChild(input);
      element._setInputElement(input);
      await nextRender();
    });

    afterEach(() => {
      inputSpy.resetHistory();
      changeSpy.resetHistory();
    });

    it('should call an input event listener', () => {
      input.dispatchEvent(new CustomEvent('input'));
      expect(inputSpy.calledOnce).to.be.true;
    });

    it('should call a change event listener', () => {
      input.dispatchEvent(new CustomEvent('change'));
      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should not call an input event listener when input is unset', async () => {
      element.removeChild(input);
      element._setInputElement(undefined);
      await nextRender();
      input.dispatchEvent(new CustomEvent('input'));
      expect(inputSpy.called).to.be.false;
    });

    it('should not call a change event listener when input is unset', async () => {
      element.removeChild(input);
      element._setInputElement(undefined);
      await nextRender();
      input.dispatchEvent(new CustomEvent('change'));
      expect(changeSpy.called).to.be.false;
    });
  });

  describe('model value seams', () => {
    let seamsTag, modelValueStub, inputValueStub;

    before(() => {
      modelValueStub = sinon.stub();
      inputValueStub = sinon.stub();

      seamsTag = defineLit(
        'input-mixin-seams',
        '<slot name="input"></slot>',
        (Base) =>
          class extends InputMixin(PolylitMixin(Base)) {
            _modelValueFromInput(viewValue, event) {
              return modelValueStub(viewValue, event);
            }

            _inputValueFromModel(value) {
              return inputValueStub(value);
            }
          },
      );
    });

    beforeEach(async () => {
      modelValueStub.reset();
      modelValueStub.callsFake((viewValue) => viewValue);
      inputValueStub.reset();
      inputValueStub.callsFake((value) => value);

      element = fixtureSync(`<${seamsTag}></${seamsTag}>`);
      await nextRender();
      input = document.createElement('input');
      input.setAttribute('slot', 'input');
      element.appendChild(input);
      element._setInputElement(input);
      await nextRender();
    });

    it('should pass the view value and the trusted input event to _modelValueFromInput', async () => {
      input.focus();
      await sendKeys({ press: 'F' });
      expect(modelValueStub).to.be.calledOnce;
      const [viewValue, event] = modelValueStub.firstCall.args;
      expect(viewValue).to.equal('F');
      expect(event.type).to.equal('input');
      expect(event.isTrusted).to.be.true;
    });

    it('should pass an event with isTrusted false to _modelValueFromInput on a fake input event', () => {
      input.value = 'foo';
      input.dispatchEvent(new Event('input'));
      const [, event] = modelValueStub.firstCall.args;
      expect(event.isTrusted).to.be.false;
    });

    it('should set value to empty string when _modelValueFromInput returns null', () => {
      modelValueStub.returns(null);
      input.value = 'foo';
      input.dispatchEvent(new Event('input'));
      expect(element.value).to.equal('');
    });

    it('should set value to undefined when _modelValueFromInput returns undefined', () => {
      modelValueStub.returns(undefined);
      input.value = 'foo';
      input.dispatchEvent(new Event('input'));
      expect(element.value).to.be.undefined;
    });

    it('should propagate the value transformed by _inputValueFromModel to the input element', async () => {
      inputValueStub.callsFake((value) => `[${value}]`);
      element.value = 'foo';
      await nextUpdate(element);
      expect(input.value).to.equal('[foo]');
    });

    it('should pass an empty string to _inputValueFromModel when value is set to null', async () => {
      inputValueStub.callsFake((value) => `[${value}]`);
      element.value = 'foo';
      await nextUpdate(element);
      element.value = null;
      await nextUpdate(element);
      expect(input.value).to.equal('[]');
    });

    it('should not transform the value with the default seam implementations', async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      input = document.createElement('input');
      input.setAttribute('slot', 'input');
      element.appendChild(input);
      element._setInputElement(input);
      await nextRender();

      input.focus();
      await sendKeys({ type: 'foo' });
      expect(element.value).to.equal('foo');

      element.value = 'bar';
      await nextUpdate(element);
      expect(input.value).to.equal('bar');
    });
  });
});
