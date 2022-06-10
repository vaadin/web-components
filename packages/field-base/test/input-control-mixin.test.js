import { expect } from '@esm-bundle/chai';
import { escKeyDown, fixtureSync, keyboardEventFor, keyDownOn } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { InputControlMixin } from '../src/input-control-mixin.js';
import { InputController } from '../src/input-controller.js';

customElements.define(
  'input-control-mixin-element',
  class extends InputControlMixin(PolymerElement) {
    static get template() {
      return html`
        <div part="label">
          <slot name="label"></slot>
        </div>
        <slot name="input"></slot>
        <button id="clearButton">Clear</button>
        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
        <slot name="helper"></slot>
      `;
    }

    get clearElement() {
      return this.$.clearButton;
    }

    constructor() {
      super();

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

describe('input-control-mixin', () => {
  let element, input;

  describe('clear button', () => {
    let button;

    beforeEach(() => {
      element = fixtureSync('<input-control-mixin-element value="foo"></input-control-mixin-element>');
      input = element.querySelector('[slot=input]');
      button = element.$.clearButton;
    });

    it('should clear the field value on clear button click', () => {
      button.click();
      expect(element.value).to.equal('');
    });

    it('should clear the input value on clear button click', () => {
      button.click();
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

    it('should reflect clearButtonVisible property to attribute', () => {
      element.clearButtonVisible = true;
      expect(element.hasAttribute('clear-button-visible')).to.be.true;

      element.clearButtonVisible = false;
      expect(element.hasAttribute('clear-button-visible')).to.be.false;
    });

    it('should clear value on Esc when clearButtonVisible is true', () => {
      element.clearButtonVisible = true;
      escKeyDown(button);
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
    beforeEach(() => {
      element = fixtureSync('<input-control-mixin-element name="foo"></input-control-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate name attribute to the input', () => {
      expect(input.getAttribute('name')).to.equal('foo');
    });

    it('should propagate name property to the input', () => {
      element.name = 'bar';
      expect(input.getAttribute('name')).to.equal('bar');
    });
  });

  describe('title', () => {
    beforeEach(() => {
      element = fixtureSync('<input-control-mixin-element title="foo"></input-control-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate title attribute to the input', () => {
      expect(input.getAttribute('title')).to.equal('foo');
    });

    it('should propagate title property to the input', () => {
      element.title = 'bar';
      expect(input.getAttribute('title')).to.equal('bar');
    });
  });

  describe('placeholder', () => {
    beforeEach(() => {
      element = fixtureSync('<input-control-mixin-element placeholder="foo"></input-control-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate placeholder attribute to the input', () => {
      expect(input.placeholder).to.equal('foo');
    });

    it('should propagate placeholder property to the input', () => {
      element.placeholder = 'bar';
      expect(input.placeholder).to.equal('bar');
    });
  });

  describe('readonly', () => {
    beforeEach(() => {
      element = fixtureSync('<input-control-mixin-element readonly></input-control-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate readonly attribute to the input', () => {
      expect(input.readOnly).to.be.true;
    });

    it('should propagate readonly property to the input', () => {
      element.readonly = false;
      expect(input.readOnly).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(() => {
      element = fixtureSync('<input-control-mixin-element required></input-control-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate required attribute to the input', () => {
      expect(input.required).to.be.true;
    });

    it('should propagate required property to the input', () => {
      element.required = false;
      expect(input.required).to.be.false;
    });
  });

  describe('invalid', () => {
    beforeEach(() => {
      element = fixtureSync('<input-control-mixin-element invalid></input-control-mixin-element>');
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

    it('should remove invalid attribute when valid', () => {
      element.invalid = false;
      expect(input.hasAttribute('invalid')).to.be.false;
    });

    it('should remove aria-invalid attribute when valid', () => {
      element.invalid = false;
      expect(input.hasAttribute('aria-invalid')).to.be.false;
    });
  });

  describe('autoselect', () => {
    beforeEach(() => {
      element = fixtureSync('<input-control-mixin-element></input-control-mixin-element>');
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
    beforeEach(() => {
      element = fixtureSync('<input-control-mixin-element></input-control-mixin-element>');
      element.allowedCharPattern = '[-+\\d]';
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

      it('should not throw an error when incorrect pattern provided', () => {
        fixtureSync('<input-control-mixin-element allowed-char-pattern="[a]*"></input-control-mixin-element>');
        expect(console.error.calledOnce).to.be.true;
      });
    });
  });
});
