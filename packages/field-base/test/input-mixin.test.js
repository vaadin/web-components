import { expect } from '@vaadin/chai-plugins';
import { defineLit, definePolymer, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { InputMixin } from '../src/input-mixin.js';

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper(
    'input-mixin',
    '<slot name="input"></slot>',
    (Base) => class extends InputMixin(baseMixin(Base)) {},
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

      eventsTag = defineHelper(
        'input-mixin-events',
        '<slot name="input"></slot>',
        (Base) =>
          class extends InputMixin(baseMixin(Base)) {
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
};

describe('InputMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('InputMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
