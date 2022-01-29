import { expect } from '@esm-bundle/chai';
import { fixtureSync, keyDownOn, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { html as legacyHtml, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, LitElement } from 'lit';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { InputController } from '../src/input-controller.js';
import { InputFieldMixin } from '../src/input-field-mixin.js';

customElements.define(
  'input-field-mixin-polymer-element',
  class extends InputFieldMixin(PolymerElement) {
    static get template() {
      return legacyHtml`
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

    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        })
      );
    }

    setEnabledCharPattern(pattern) {
      this._enabledCharPattern = pattern;
    }
  }
);

customElements.define(
  'input-field-mixin-lit-element',
  class extends InputFieldMixin(PolylitMixin(LitElement)) {
    render() {
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

    setEnabledCharPattern(pattern) {
      this._enabledCharPattern = pattern;
    }
  },
);

const runTests = (baseClass) => {
  const tag = `input-field-mixin-${baseClass}-element`;

  const updateComplete = () => (baseClass === 'lit' ? element.updateComplete : Promise.resolve());

  let element, input;

  describe('properties', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate autocomplete property to the input', async () => {
      element.autocomplete = 'on';
      await updateComplete();
      expect(input.autocomplete).to.equal('on');
    });

    it('should propagate autocorrect property to the input', async () => {
      element.autocorrect = 'on';
      await updateComplete();
      expect(input.getAttribute('autocorrect')).to.equal('on');
    });

    it('should propagate autocapitalize property to the input', async () => {
      element.autocapitalize = 'none';
      await updateComplete();
      expect(input.getAttribute('autocapitalize')).to.equal('none');
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
      input = element.querySelector('[slot=input]');
    });

    it('should validate on input blur', () => {
      const spy = sinon.spy(element, 'validate');
      input.dispatchEvent(new Event('blur'));
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate on input event', async () => {
      element.required = true;
      element.invalid = true;
      await updateComplete();
      const spy = sinon.spy(element, 'validate');
      input.focus();
      await sendKeys({ type: 'f' });
      expect(spy.calledOnce).to.be.true;
      expect(element.invalid).to.be.false;
    });

    it('should validate on value change when field is invalid', async () => {
      const spy = sinon.spy(element, 'validate');
      element.invalid = true;
      element.value = 'foo';
      await updateComplete();
      expect(spy.calledOnce).to.be.true;
    });

    it('should call checkValidity on the input when required', () => {
      const spy = sinon.spy(input, 'checkValidity');
      element.required = true;
      element.checkValidity();
      expect(spy.calledOnce).to.be.true;
    });

    it('should not call checkValidity on the input when not required', () => {
      const spy = sinon.spy(input, 'checkValidity');
      element.checkValidity();
      expect(spy.calledOnce).to.be.false;
    });
  });

  describe('slotted input value', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
      element = document.createElement(tag);
    });

    afterEach(() => {
      document.body.removeChild(element);
      console.warn.restore();
    });

    it('should warn when value is set on the slotted input', async () => {
      input = document.createElement('input');
      input.setAttribute('slot', 'input');
      input.value = 'foo';
      element.appendChild(input);
      document.body.appendChild(element);
      await updateComplete();
      await nextFrame();
      expect(console.warn.called).to.be.true;
    });

    it('should not warn when value is set on the element itself', async () => {
      element.value = 'foo';
      document.body.appendChild(element);
      await updateComplete();
      expect(console.warn.called).to.be.false;
    });
  });

  describe('enabled char pattern', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
      element.setEnabledCharPattern('[-+\\d]');
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
          // because the same can be done by typing
          const event = fireEvent('1-2+3');
          expect(event.defaultPrevented).to.be.false;
        });
      });
    };

    testEvent('drop', fireDropEvent);
    testEvent('paste', firePasteEvent);
    testEvent('beforeinput', fireBeforeInputEvent);
  });
};

describe('InputFieldMixin + Polymer', () => {
  runTests('polymer');
});

describe('InputFieldMixin + Lit', () => {
  runTests('lit');
});
