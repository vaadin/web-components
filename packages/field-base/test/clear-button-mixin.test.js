import { expect } from '@esm-bundle/chai';
import {
  defineLit,
  definePolymer,
  escKeyDown,
  fixtureSync,
  keyboardEventFor,
  keyDownOn,
  nextFrame,
  nextRender,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
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

  let element, input, button;

  beforeEach(async () => {
    element = fixtureSync(`<${tag} value="foo"></${tag}>`);
    await nextRender();
    input = element.querySelector('[slot=input]');
    button = element.clearElement;
  });

  it('should clear the field value on clear button click', async () => {
    button.click();
    await nextFrame();
    expect(element.value).to.equal('');
  });

  it('should clear the input value on clear button click', async () => {
    button.click();
    await nextFrame();
    expect(input.value).to.equal('');
  });

  it('should focus the input on clear button click', () => {
    const spy = sinon.spy(input, 'focus');
    button.click();
    expect(spy.calledOnce).to.be.true;
  });

  it('should dispatch input event on clear button click', () => {
    const spy = sinon.spy();
    input.addEventListener('input', spy);
    button.click();
    expect(spy.calledOnce).to.be.true;
    const event = spy.firstCall.args[0];
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.true;
  });

  it('should dispatch change event on clear button click', () => {
    const spy = sinon.spy();
    element.addEventListener('change', spy);
    button.click();
    expect(spy.calledOnce).to.be.true;
    const event = spy.firstCall.args[0];
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.false;
  });

  it('should call preventDefault on the button click event', () => {
    const event = new CustomEvent('click', { cancelable: true });
    button.dispatchEvent(event);
    expect(event.defaultPrevented).to.be.true;
  });

  it('should reflect clearButtonVisible property to attribute', async () => {
    element.clearButtonVisible = true;
    await nextFrame();
    expect(element.hasAttribute('clear-button-visible')).to.be.true;

    element.clearButtonVisible = false;
    await nextFrame();
    expect(element.hasAttribute('clear-button-visible')).to.be.false;
  });

  it('should clear value on Esc when clearButtonVisible is true', async () => {
    element.clearButtonVisible = true;
    escKeyDown(button);
    await nextFrame();
    expect(input.value).to.equal('');
  });

  it('should not clear value on Esc when clearButtonVisible is false', () => {
    escKeyDown(button);
    expect(input.value).to.equal('foo');
  });

  it('should dispatch input event when clearing value on Esc', () => {
    const spy = sinon.spy();
    input.addEventListener('input', spy);
    element.clearButtonVisible = true;
    escKeyDown(button);
    expect(spy.calledOnce).to.be.true;
    const event = spy.firstCall.args[0];
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.true;
  });

  it('should dispatch change event when clearing value on Esc', () => {
    const spy = sinon.spy();
    input.addEventListener('change', spy);
    element.clearButtonVisible = true;
    escKeyDown(button);
    expect(spy.calledOnce).to.be.true;
    const event = spy.firstCall.args[0];
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.false;
  });

  it('should call stopPropagation() on Esc when clearButtonVisible is true', () => {
    element.clearButtonVisible = true;
    const event = keyboardEventFor('keydown', 27, [], 'Escape');
    const spy = sinon.spy(event, 'stopPropagation');
    button.dispatchEvent(event);
    expect(spy.called).to.be.true;
  });

  it('should not call stopPropagation() on Esc when clearButtonVisible is false', () => {
    const event = keyboardEventFor('keydown', 27, [], 'Escape');
    const spy = sinon.spy(event, 'stopPropagation');
    button.dispatchEvent(event);
    expect(spy.called).to.be.false;
  });
};

describe('ClearButtonMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('ClearButtonMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
