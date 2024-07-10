import { expect } from '@esm-bundle/chai';
import {
  defineLit,
  definePolymer,
  escKeyDown,
  fixtureSync,
  keyboardEventFor,
  keyDownOn,
  mousedown,
  nextRender,
  nextUpdate,
} from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { InputControlMixin } from '../src/input-control-mixin.js';
import { InputController } from '../src/input-controller.js';

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper(
    'input-control-mixin',
    `
      <div part="label">
        <slot name="label"></slot>
      </div>
      <slot name="input"></slot>
      <button id="clearButton">Clear</button>
      <div part="error-message">
        <slot name="error-message"></slot>
      </div>
      <slot name="helper"></slot>
    `,
    (Base) =>
      class extends InputControlMixin(baseMixin(Base)) {
        get clearElement() {
          return this.$.clearButton;
        }

        ready() {
          super.ready();

          this.addController(
            new InputController(this, (input) => {
              this._setInputElement(input);
              this._setFocusElement(input);
              this.stateTarget = input;
              this.ariaTarget = input;
            }),
          );
        }
      },
  );

  let element, input;

  describe('clear button', () => {
    let button;

    beforeEach(async () => {
      element = fixtureSync(`<${tag} value="foo"></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
      button = element.clearElement;
    });

    it('should clear the field value on clear button click', async () => {
      button.click();
      await nextUpdate(element);
      expect(element.value).to.equal('');
    });

    it('should clear the input value on clear button click', async () => {
      button.click();
      await nextUpdate(element);
      expect(input.value).to.equal('');
    });

    (!isTouch ? it : it.skip)('should focus the input on clear clearButton mousedown', () => {
      const spy = sinon.spy(input, 'focus');
      mousedown(button);
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
      await nextUpdate(element);
      expect(element.hasAttribute('clear-button-visible')).to.be.true;

      element.clearButtonVisible = false;
      await nextUpdate(element);
      expect(element.hasAttribute('clear-button-visible')).to.be.false;
    });

    it('should clear value on Esc when clearButtonVisible is true', async () => {
      element.clearButtonVisible = true;
      escKeyDown(button);
      await nextUpdate(element);
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
  });

  describe('name', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} name="foo"></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate name attribute to the input', () => {
      expect(input.getAttribute('name')).to.equal('foo');
    });

    it('should propagate name property to the input', async () => {
      element.name = 'bar';
      await nextUpdate(element);
      expect(input.getAttribute('name')).to.equal('bar');
    });
  });

  describe('title', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} title="foo"></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate title attribute to the input', () => {
      expect(input.getAttribute('title')).to.equal('foo');
    });

    it('should propagate title property to the input', async () => {
      element.title = 'bar';
      await nextUpdate(element);
      expect(input.getAttribute('title')).to.equal('bar');
    });
  });

  describe('placeholder', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} placeholder="foo"></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate placeholder attribute to the input', () => {
      expect(input.placeholder).to.equal('foo');
    });

    it('should propagate placeholder property to the input', async () => {
      element.placeholder = 'bar';
      await nextUpdate(element);
      expect(input.placeholder).to.equal('bar');
    });
  });

  describe('readonly', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} readonly></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate readonly attribute to the input', () => {
      expect(input.readOnly).to.be.true;
    });

    it('should propagate readonly property to the input', async () => {
      element.readonly = false;
      await nextUpdate(element);
      expect(input.readOnly).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} required></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate required attribute to the input', () => {
      expect(input.required).to.be.true;
    });

    it('should propagate required property to the input', async () => {
      element.required = false;
      await nextUpdate(element);
      expect(input.required).to.be.false;
    });
  });

  describe('invalid', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} invalid></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should not reset invalid state set with attribute', () => {
      expect(element.invalid).to.be.true;
    });

    it('should set invalid attribute on the input', () => {
      expect(input.hasAttribute('invalid')).to.be.true;
    });

    it('should set aria-invalid attribute on the input', () => {
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });

    it('should remove invalid attribute when valid', async () => {
      element.invalid = false;
      await nextUpdate(element);
      expect(input.hasAttribute('invalid')).to.be.false;
    });

    it('should remove aria-invalid attribute when valid', async () => {
      element.invalid = false;
      await nextUpdate(element);
      expect(input.hasAttribute('aria-invalid')).to.be.false;
    });
  });

  describe('autoselect', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should select the input content when autoselect is set', () => {
      const spy = sinon.spy(input, 'select');
      element.autoselect = true;
      input.focus();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('allowed char pattern', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      element.allowedCharPattern = '[-+\\d]';
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    describe('keyboard input', () => {
      let keydownSpy;

      beforeEach(() => {
        keydownSpy = sinon.spy();
        input.addEventListener('keydown', keydownSpy);
      });

      [
        [188, [], ','],
        [190, [], '.'],
        [69, [], 'e'],
        [69, ['shift'], 'E'],
        [106, [], '*'],
        [32, [], ' '],
        [187, [], '?'],
      ].forEach(([keyCode, modifiers, key]) => {
        const keyCombo = modifiers.concat(key).join('+');

        it(`should prevent "${keyCombo}"`, () => {
          keyDownOn(input, keyCode, modifiers, key);
          const event = keydownSpy.lastCall.args[0];
          expect(event.defaultPrevented).to.be.true;
        });
      });

      [
        [49, [], '1'],
        [187, [], '+'],
        [189, [], '-'],
        [49, ['ctrl'], '1'],
        [49, ['meta'], '1'],
        [65, ['ctrl'], 'e'],
        [65, ['meta'], 'e'],
        [65, ['ctrl', 'shift'], 'E'],
        [112, [], 'F1'],
        [8, [], 'Backspace'],
        [37, [], 'ArrowLeft'],
        [37, ['ctrl'], 'ArrowLeft'],
      ].forEach(([keyCode, modifiers, key]) => {
        const keyCombo = modifiers.concat(key).join('+');

        it(`should not prevent "${keyCombo}"`, () => {
          keyDownOn(input, keyCode, modifiers, key);
          const event = keydownSpy.lastCall.args[0];
          expect(event.defaultPrevented).to.be.false;
        });
      });

      it('should temporarily set input-prevented attribute when keydown is prevented', () => {
        keyDownOn(input, 32, [], ' ');
        expect(element.hasAttribute('input-prevented')).to.be.true;

        element._preventInputDebouncer.flush();
        expect(element.hasAttribute('input-prevented')).to.be.false;
      });

      it('should not prevent input for other slotted inputs', async () => {
        const checkbox = fixtureSync(`<input type="checkbox" slot="helper"/>`);
        element.appendChild(checkbox);
        checkbox.focus();

        await sendKeys({ press: 'Space' });

        expect(checkbox.checked).to.be.true;
      });
    });

    const fireDropEvent = (draggedText) => {
      const event = new Event('drop', {
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      event.dataTransfer = {
        getData: () => draggedText,
      };
      input.dispatchEvent(event);
      return event;
    };

    const firePasteEvent = (pastedText) => {
      const event = new Event('paste', {
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      event.clipboardData = {
        getData: () => pastedText,
      };
      input.dispatchEvent(event);
      return event;
    };

    const fireBeforeInputEvent = (textToInput) => {
      const event = new Event('beforeinput', {
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      event.data = textToInput;
      input.dispatchEvent(event);
      return event;
    };

    const testEvent = (eventName, fireEvent) => {
      describe(`${eventName} event`, () => {
        it(`should prevent ${eventName} with text`, () => {
          const event = fireEvent('foo');
          expect(event.defaultPrevented).to.be.true;
        });

        it(`should prevent ${eventName} with decimals`, () => {
          const event = fireEvent('1.2');
          expect(event.defaultPrevented).to.be.true;
        });

        it(`should not prevent ${eventName} with integer`, () => {
          const event = fireEvent('123');
          expect(event.defaultPrevented).to.be.false;
        });

        it(`should not prevent ${eventName} with negative integer`, () => {
          const event = fireEvent('-123');
          expect(event.defaultPrevented).to.be.false;
        });

        it(`should not prevent ${eventName} with minus and plus signs`, () => {
          // Because the same can be done by typing
          const event = fireEvent('1-2+3');
          expect(event.defaultPrevented).to.be.false;
        });

        it(`should temporarily set input-prevented attribute when ${eventName} is prevented`, () => {
          fireEvent('foo');
          expect(element.hasAttribute('input-prevented')).to.be.true;

          element._preventInputDebouncer.flush();
          expect(element.hasAttribute('input-prevented')).to.be.false;
        });
      });
    };

    testEvent('drop', fireDropEvent);
    testEvent('paste', firePasteEvent);
    testEvent('beforeinput', fireBeforeInputEvent);

    describe('incorrect pattern', () => {
      beforeEach(() => {
        sinon.stub(console, 'error');
      });

      afterEach(() => {
        console.error.restore();
      });

      it('should not throw an error when incorrect pattern provided', async () => {
        fixtureSync(`<${tag} allowed-char-pattern="[a]*"></${tag}>`);
        await nextRender();
        expect(console.error.calledOnce).to.be.true;
      });
    });
  });
};

describe('InputControlMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('InputControlMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
