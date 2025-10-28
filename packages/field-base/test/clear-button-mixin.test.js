import { expect } from '@vaadin/chai-plugins';
import {
  defineLit,
  definePolymer,
  escKeyDown,
  fixtureSync,
  keyboardEventFor,
  mousedown,
  nextRender,
  nextUpdate,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ClearButtonMixin } from '../src/clear-button-mixin.js';
import { InputController } from '../src/input-controller.js';

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper(
    'clear-button-mixin',
    `
      <slot name="input"></slot>
      <button id="clearButton">Clear</button>
    `,
    (Base) =>
      class extends ClearButtonMixin(baseMixin(Base)) {
        get clearElement() {
          return this.$.clearButton;
        }

        ready() {
          super.ready();

          this.addController(
            new InputController(this, (input) => {
              this._setInputElement(input);
            }),
          );
        }
      },
  );

  let element, input, clearButton;

  describe('basic', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} value="foo"></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
      clearButton = element.clearElement;
    });

    it('should clear the field value on clear button click', async () => {
      clearButton.click();
      await nextUpdate(element);
      expect(element.value).to.equal('');
    });

    it('should clear the input value on clear button click', async () => {
      clearButton.click();
      await nextUpdate(element);
      expect(input.value).to.equal('');
    });

    (!isTouch ? it : it.skip)('should focus the input on clear button mousedown', () => {
      const spy = sinon.spy(input, 'focus');
      mousedown(clearButton);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not prevent default on clear button mousedown if input is not focused', () => {
      const event = new CustomEvent('mousedown', { cancelable: true });
      clearButton.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.false;
    });

    it('should prevent default on clear button mousedown if input is focused', () => {
      input.focus();
      const event = new CustomEvent('mousedown', { cancelable: true });
      clearButton.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    (isTouch ? it : it.skip)('should not focus the input on clear button touch', () => {
      const spy = sinon.spy(input, 'focus');
      mousedown(clearButton);
      expect(spy.called).to.be.false;
    });

    (isTouch ? it : it.skip)('should keep focus at the input on clear button touch', () => {
      input.focus();
      mousedown(clearButton);
      expect(document.activeElement).to.be.equal(input);
    });

    it('should dispatch input event on clear button click', () => {
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      clearButton.click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should dispatch change event on clear button click', () => {
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      clearButton.click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.false;
    });

    it('should call preventDefault on the button click event', () => {
      const event = new CustomEvent('click', { cancelable: true });
      clearButton.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should set clearButtonVisible to false by default', () => {
      expect(element.clearButtonVisible).to.be.false;
    });

    it('should reflect clearButtonVisible property to attribute', async () => {
      element.clearButtonVisible = true;
      await nextUpdate(element);
      expect(element.hasAttribute('clear-button-visible')).to.be.true;

      element.clearButtonVisible = false;
      await nextUpdate(element);
      expect(element.hasAttribute('clear-button-visible')).to.be.false;
    });

    it('should clear value on Esc when clearButtonVisible is true', async () => {
      element.clearButtonVisible = true;
      escKeyDown(clearButton);
      await nextUpdate(element);
      expect(input.value).to.equal('');
    });

    it('should not clear value on Esc when clearButtonVisible is false', () => {
      escKeyDown(clearButton);
      expect(input.value).to.equal('foo');
    });

    it('should not clear value on Esc when readonly is true', () => {
      element.clearButtonVisible = true;
      element.readonly = true;
      escKeyDown(clearButton);
      expect(input.value).to.equal('foo');
    });

    it('should dispatch input event when clearing value on Esc', () => {
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      element.clearButtonVisible = true;
      escKeyDown(clearButton);
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should dispatch change event when clearing value on Esc', () => {
      const spy = sinon.spy();
      input.addEventListener('change', spy);
      element.clearButtonVisible = true;
      escKeyDown(clearButton);
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.false;
    });

    it('should call stopPropagation() on Esc when clearButtonVisible is true', () => {
      element.clearButtonVisible = true;
      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const spy = sinon.spy(event, 'stopPropagation');
      clearButton.dispatchEvent(event);
      expect(spy.called).to.be.true;
    });

    it('should not call stopPropagation() on Esc when clearButtonVisible is false', () => {
      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const spy = sinon.spy(event, 'stopPropagation');
      clearButton.dispatchEvent(event);
      expect(spy.called).to.be.false;
    });
  });
};

describe('ClearButtonMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('ClearButtonMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
