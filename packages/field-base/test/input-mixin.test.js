import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { InputMixin } from '../src/input-mixin.js';
import { define } from './helpers.js';

const runTests = (baseClass) => {
  const tag = define[baseClass](
    'input-mixin',
    '<slot name="input"></slot>',
    (Base) => class extends InputMixin(Base) {},
  );

  let element, input;

  describe('type', () => {
    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
    });

    it('should have a read-only type property', () => {
      expect(element.type).to.be.undefined;
      element.type = 'number';
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
      await nextFrame();
    });

    it('should set property to empty string by default', () => {
      expect(element.value).to.be.equal('');
    });

    it('should not set has-value attribute by default', () => {
      expect(element.hasAttribute('has-value')).to.be.false;
    });

    it('should set has-value attribute when value attribute is set', async () => {
      element.setAttribute('value', 'test');
      await nextFrame();
      expect(element.hasAttribute('has-value')).to.be.true;
    });

    it('should set has-value attribute when value property is set', async () => {
      element.value = 'test';
      await nextFrame();
      expect(element.hasAttribute('has-value')).to.be.true;
    });

    it('should remove has-value attribute when value is removed', async () => {
      element.value = 'foo';
      await nextFrame();
      element.value = '';
      await nextFrame();
      expect(element.hasAttribute('has-value')).to.be.false;
    });

    it('should propagate value to the input element', async () => {
      element.value = 'foo';
      await nextFrame();
      expect(input.value).to.equal('foo');
    });

    it('should clear input value when value is set to null', async () => {
      element.value = 'foo';
      await nextFrame();
      element.value = null;
      await nextFrame();
      expect(input.value).to.equal('');
    });

    it('should clear input value when value is set to undefined', async () => {
      element.value = 'foo';
      await nextFrame();
      element.value = undefined;
      await nextFrame();
      expect(input.value).to.equal('');
    });

    it('should update field value on the input event', () => {
      input.value = 'foo';
      input.dispatchEvent(new Event('input'));
      expect(element.value).to.equal('foo');
    });

    it('should clear the field value on clear method call', async () => {
      element.value = 'foo';
      await nextFrame();
      element.clear();
      await nextFrame();
      expect(element.value).to.equal('');
    });

    it('should clear the input value on clear method call', async () => {
      element.value = 'foo';
      await nextFrame();
      element.clear();
      await nextFrame();
      expect(input.value).to.equal('');
    });
  });

  describe('events', () => {
    let eventsTag, inputSpy, changeSpy;

    before(() => {
      inputSpy = sinon.spy();
      changeSpy = sinon.spy();

      eventsTag = define[baseClass](
        'input-mixin-events',
        '<slot name="input"></slot>',
        (Base) =>
          class extends InputMixin(Base) {
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
      await nextFrame();
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
      await nextFrame();
      input.dispatchEvent(new CustomEvent('input'));
      expect(inputSpy.called).to.be.false;
    });

    it('should not call a change event listener when input is unset', async () => {
      element.removeChild(input);
      element._setInputElement(undefined);
      await nextFrame();
      input.dispatchEvent(new CustomEvent('change'));
      expect(changeSpy.called).to.be.false;
    });
  });

  describe('has-input-value-changed event', () => {
    let tag, hasInputValueChangedSpy;

    before(() => {
      tag = define[baseClass](
        'input-mixin-has-input-value-changed-event',
        '<slot name="input"></slot>',
        (Base) => class extends InputMixin(Base) {},
      );
    });

    beforeEach(async () => {
      hasInputValueChangedSpy = sinon.spy();
      element = fixtureSync(`<${tag}></${tag}>`);
      element.addEventListener('has-input-value-changed', hasInputValueChangedSpy);
      await nextRender();
      input = document.createElement('input');
      element.appendChild(input);
      element._setInputElement(input);
      await nextFrame();
    });

    it('should fire the event on input value presence change', async () => {
      input.value = 'foo';
      fire(input, 'input');
      await nextFrame();
      expect(hasInputValueChangedSpy.calledOnce).to.be.true;

      hasInputValueChangedSpy.resetHistory();
      input.value = '';
      fire(input, 'input');
      await nextFrame();
      expect(hasInputValueChangedSpy.calledOnce).to.be.true;
    });

    it('should not fire the event on input if input value presence has not changed', async () => {
      input.value = 'foo';
      fire(input, 'input');
      await nextFrame();
      hasInputValueChangedSpy.resetHistory();

      input.value = 'foobar';
      fire(input, 'input');
      await nextFrame();
      expect(hasInputValueChangedSpy.called).to.be.false;
    });
  });
};

describe('InputMixin + Polymer', () => {
  runTests('polymer');
});

describe('InputMixin + Lit', () => {
  runTests('lit');
});
