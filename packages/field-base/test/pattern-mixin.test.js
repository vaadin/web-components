import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { InputController } from '../src/input-controller.js';
import { PatternMixin } from '../src/pattern-mixin.js';
import { define } from './helpers.js';

const runTests = (baseClass) => {
  const tag = define[baseClass](
    'pattern-mixin',
    '<slot name="input"></slot>',
    (Base) =>
      class extends PatternMixin(Base) {
        ready() {
          super.ready();

          this.addController(
            new InputController(this, (input) => {
              this._setInputElement(input);
              this.stateTarget = input;
            }),
          );
        }
      },
  );

  let element, input;

  beforeEach(async () => {
    element = fixtureSync(`<${tag}></${tag}>`);
    await nextRender();
    input = element.querySelector('[slot=input]');
  });

  describe('pattern', () => {
    it('should propagate pattern property to the input', async () => {
      element.pattern = '[-+\\d]';
      await nextFrame();
      expect(input.pattern).to.equal('[-+\\d]');
    });

    it('should not validate the field when pattern is set', async () => {
      element.pattern = '[-+\\d]';
      await nextFrame();
      expect(element.invalid).to.be.false;
    });

    it('should validate the field when invalid after pattern is changed', async () => {
      element.invalid = true;
      await nextFrame();
      const spy = sinon.spy(element, 'validate');
      element.pattern = '[-+\\d]';
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should update invalid state when pattern is removed', async () => {
      input.value = '123foo';
      element.pattern = '\\d+';
      await nextFrame();

      element.validate();
      expect(element.invalid).to.be.true;

      element.pattern = '';
      await nextFrame();
      expect(element.invalid).to.be.false;
    });
  });

  describe('prevent invalid input', () => {
    beforeEach(async () => {
      sinon.stub(console, 'warn');
      element.preventInvalidInput = true;
      element.value = '1';
      await nextFrame();
    });

    afterEach(() => {
      console.warn.restore();
    });

    function inputText(value) {
      input.value = value;
      input.dispatchEvent(new CustomEvent('input'));
    }

    it('should warn about using preventInvalidInput', () => {
      expect(console.warn.calledOnce).to.be.true;
    });

    it('should prevent invalid pattern', async () => {
      element.pattern = '[0-9]*';
      await nextFrame();
      inputText('f');
      await nextFrame();
      expect(element.value).to.equal('1');
    });

    it('should temporarily set input-prevented attribute on invalid input', async () => {
      element.pattern = '[0-9]*';
      await nextFrame();
      inputText('f');
      await nextFrame();
      expect(element.hasAttribute('input-prevented')).to.be.true;
    });

    it('should not set input-prevented attribute on valid input', async () => {
      element.pattern = '[0-9]*';
      await nextFrame();
      inputText('1');
      await nextFrame();
      expect(element.hasAttribute('input-prevented')).to.be.false;
    });

    it('should remove input-prevented attribute after 200ms timeout', async () => {
      element.pattern = '[0-9]*';
      await nextFrame();
      const clock = sinon.useFakeTimers();
      inputText('f');
      clock.tick(200);
      expect(element.hasAttribute('input-prevented')).to.be.false;
      clock.restore();
    });

    it('should prevent entering invalid characters', async () => {
      element.value = '';
      element.pattern = '[0-9]*';
      await nextFrame();
      inputText('f');
      await nextFrame();
      expect(input.value).to.equal('');
    });

    it('should not fire value-changed event when prevented', async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      element.pattern = '[0-9]*';
      await nextFrame();
      inputText('f');
      await nextFrame();
      expect(spy.called).to.be.false;
    });

    it('should not prevent valid pattern', async () => {
      element.pattern = '[0-9]*';
      await nextFrame();
      inputText('2');
      await nextFrame();
      expect(input.value).to.equal('2');
    });

    it('should not prevent too short value', async () => {
      input.minlength = 1;
      await nextFrame();
      inputText('');
      await nextFrame();
      expect(input.value).to.equal('');
    });

    it('should not prevent empty value for required field', async () => {
      element.required = true;
      await nextFrame();
      inputText('');
      await nextFrame();
      expect(input.value).to.equal('');
    });
  });
};

describe('PatternMixin + Polymer', () => {
  runTests('polymer');
});

describe('PatternMixin + Lit', () => {
  runTests('lit');
});
