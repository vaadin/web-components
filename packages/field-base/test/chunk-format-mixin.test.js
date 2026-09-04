import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { defineLit, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import { ChunkFormatMixin } from '../src/chunk-format-mixin.js';
import { InputControlMixin } from '../src/input-control-mixin.js';
import { InputController } from '../src/input-controller.js';

const IBAN = { blocks: [4, 4, 4, 4, 2] };
const PHONE = { blocks: [3, 3, 4] };

describe('ChunkFormatMixin', () => {
  const tag = defineLit(
    'chunk-format-mixin',
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
      class extends ChunkFormatMixin(InputControlMixin(PolylitMixin(Base))) {
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

  beforeEach(async () => {
    clearWarnings();
    element = fixtureSync(`<${tag}></${tag}>`);
    await nextRender();
    input = element.querySelector('[slot=input]');
  });

  describe('typing', () => {
    beforeEach(async () => {
      element.format = IBAN;
      await nextUpdate(element);
      input.focus();
    });

    it('should group the typed text into the configured blocks', async () => {
      await sendKeys({ type: 'FI2112345600000785' });
      expect(input.value).to.equal('FI21 1234 5600 0007 85');
    });

    it('should keep value unformatted while typing', async () => {
      await sendKeys({ type: 'FI2112345600000785' });
      expect(element.value).to.equal('FI2112345600000785');
    });

    it('should mirror the presented text in formattedValue', async () => {
      await sendKeys({ type: 'FI2112345600000785' });
      expect(element.formattedValue).to.equal('FI21 1234 5600 0007 85');
    });

    it('should keep the caret after the typed text', async () => {
      await sendKeys({ type: 'FI2112345600000785' });
      expect(input.selectionStart).to.equal('FI21 1234 5600 0007 85'.length);
    });

    it('should keep the overflow of a value longer than the format', async () => {
      await sendKeys({ type: 'FI2112345600000785999' });
      expect(input.value).to.equal('FI21 1234 5600 0007 85 999');
      expect(element.value).to.equal('FI2112345600000785999');
    });

    it('should fire one value-changed event per keystroke', async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      await sendKeys({ type: 'FI21' });
      expect(spy).to.have.callCount(4);
    });

    it('should group the typed text with another set of blocks', async () => {
      element.format = PHONE;
      await nextUpdate(element);
      await sendKeys({ type: '5551234567' });
      expect(input.value).to.equal('555 123 4567');
      expect(element.value).to.equal('5551234567');
    });

    it('should use the configured delimiter', async () => {
      element.format = { blocks: [3, 3, 4], delimiter: '-' };
      await nextUpdate(element);
      await sendKeys({ type: '5551234567' });
      expect(input.value).to.equal('555-123-4567');
      expect(element.value).to.equal('5551234567');
    });

    it('should apply the configured case to the presented text', async () => {
      element.format = { blocks: [4, 4], case: 'upper' };
      await nextUpdate(element);
      await sendKeys({ type: 'fi211234' });
      expect(input.value).to.equal('FI21 1234');
    });

    it('should apply the configured case to the value', async () => {
      element.format = { blocks: [4, 4], case: 'upper' };
      await nextUpdate(element);
      await sendKeys({ type: 'fi211234' });
      expect(element.value).to.equal('FI211234');
    });
  });

  describe('format set as attribute', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} format='{"blocks":[4,4]}'></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
      input.focus();
    });

    it('should parse the format from the JSON attribute', async () => {
      await sendKeys({ type: 'FI211234' });
      expect(input.value).to.equal('FI21 1234');
      expect(element.value).to.equal('FI211234');
    });
  });

  describe('caret while typing', () => {
    beforeEach(async () => {
      element.format = IBAN;
      element.value = 'FI211234';
      await nextUpdate(element);
      input.focus();
    });

    it('should keep the caret next to the character typed in the middle', async () => {
      input.setSelectionRange(2, 2);
      await sendKeys({ type: '9' });
      expect(input.value).to.equal('FI92 1123 4');
      expect(input.selectionStart).to.equal(3);
    });

    it('should reformat the view when a selection is replaced by a shorter insert', async () => {
      input.setSelectionRange(0, 3);
      await sendKeys({ type: 'X' });
      expect(input.value).to.equal('X112 34');
      expect(element.value).to.equal('X11234');
    });

    it('should keep the caret next to the character that replaced a selection', async () => {
      input.setSelectionRange(0, 3);
      await sendKeys({ type: 'X' });
      expect(input.selectionStart).to.equal(1);
    });

    it('should move the caret past a delimiter inserted in front of it', async () => {
      input.setSelectionRange(3, 3);
      await sendKeys({ type: '9' });
      expect(input.value).to.equal('FI29 1123 4');
      expect(input.selectionStart).to.equal(5);
    });
  });

  describe('deleting', () => {
    // The delimiter of `FI21 5678` is at index 4, so the caret is next to it at
    // index 4 and at index 5, and away from it at index 2 and index 6.
    beforeEach(async () => {
      element.format = IBAN;
      element.value = 'FI215678';
      await nextUpdate(element);
      input.focus();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should delete the character before the delimiter on Backspace', async () => {
      input.setSelectionRange(5, 5);
      await sendKeys({ press: 'Backspace' });
      expect(element.value).to.equal('FI25678');
      expect(input.selectionStart).to.equal(3);
    });

    it('should delete the character after the delimiter on Delete', async () => {
      input.setSelectionRange(4, 4);
      await sendKeys({ press: 'Delete' });
      expect(element.value).to.equal('FI21678');
      expect(input.selectionStart).to.equal(4);
    });

    it('should delete natively on Backspace away from the delimiter', async () => {
      input.setSelectionRange(2, 2);
      await sendKeys({ press: 'Backspace' });
      expect(element.value).to.equal('F215678');
      expect(input.selectionStart).to.equal(1);
    });

    it('should delete natively on Delete away from the delimiter', async () => {
      input.setSelectionRange(6, 6);
      await sendKeys({ press: 'Delete' });
      expect(element.value).to.equal('FI21578');
      expect(input.selectionStart).to.equal(6);
    });

    it('should leave the presented text ungrouped after a widened deletion', async () => {
      input.setSelectionRange(5, 5);
      await sendKeys({ press: 'Backspace' });
      expect(input.value).to.equal('FI25678');
      expect(element.formattedValue).to.equal('FI25678');
    });

    it('should regroup the presented text on the next insertion', async () => {
      input.setSelectionRange(5, 5);
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ type: '9' });
      expect(input.value).to.equal('FI29 5678');
      expect(element.value).to.equal('FI295678');
    });

    it('should fire one value-changed event for a widened deletion', async () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      input.setSelectionRange(5, 5);
      await sendKeys({ press: 'Backspace' });
      expect(spy).to.be.calledOnce;
    });

    it('should keep a widened deletion in the native undo stack', async () => {
      input.setSelectionRange(5, 5);
      await sendKeys({ press: 'Backspace' });
      document.execCommand('undo');
      expect(input.value).to.equal('FI21 5678');
      expect(element.value).to.equal('FI215678');
    });

    describe('execCommand fallback', () => {
      beforeEach(() => {
        const stub = sinon.stub(document, 'execCommand');
        stub.callsFake((command, ...args) => {
          // Leaves the text untouched for the deletion, which is what makes the
          // mixin rewrite it by hand, and lets every other command through.
          return command === 'delete' ? false : stub.wrappedMethod.call(document, command, ...args);
        });
      });

      it('should rewrite the text when the browser performs no deletion', async () => {
        input.setSelectionRange(5, 5);
        await sendKeys({ press: 'Backspace' });
        expect(element.value).to.equal('FI25678');
        expect(input.value).to.equal('FI25678');
        expect(element.formattedValue).to.equal('FI25678');
        expect(input.selectionStart).to.equal(3);
      });

      it('should fire one value-changed event for a rewritten deletion', async () => {
        const spy = sinon.spy();
        element.addEventListener('value-changed', spy);
        input.setSelectionRange(5, 5);
        await sendKeys({ press: 'Backspace' });
        expect(spy).to.be.calledOnce;
      });

      it('should lose the undo history for a rewritten deletion', async () => {
        input.setSelectionRange(5, 5);
        await sendKeys({ press: 'Backspace' });
        document.execCommand('undo');
        expect(input.value).to.equal('FI25678');
        expect(element.value).to.equal('FI25678');
      });
    });
  });

  describe('programmatic value', () => {
    beforeEach(async () => {
      element.format = IBAN;
      element.value = 'FI211234';
      await nextUpdate(element);
    });

    it('should present the value in its grouped form', () => {
      expect(input.value).to.equal('FI21 1234');
      expect(element.formattedValue).to.equal('FI21 1234');
    });

    it('should accept an already formatted value', async () => {
      element.value = 'FI21 1234 5600';
      await nextUpdate(element);
      expect(input.value).to.equal('FI21 1234 5600');
      expect(element.formattedValue).to.equal('FI21 1234 5600');
    });

    it('should keep the caret at the same raw index while focused', async () => {
      input.focus();
      input.setSelectionRange(6, 6);
      element.value = 'FI2112345600';
      await nextUpdate(element);

      // Raw index 5, which is view index 6 in `FI21 1234 5600`.
      expect(input.value).to.equal('FI21 1234 5600');
      expect(input.selectionStart).to.equal(6);
    });

    it('should reset the presentation on clear', async () => {
      element.clear();
      await nextUpdate(element);
      expect(element.value).to.equal('');
      expect(element.formattedValue).to.equal('');
      expect(input.value).to.equal('');
    });
  });

  describe('changing format at runtime', () => {
    beforeEach(async () => {
      element.format = IBAN;
      element.value = 'FI2112345600000785';
      await nextUpdate(element);
    });

    it('should regroup the presented text when the blocks change', async () => {
      element.format = { blocks: [2, 4, 4, 4, 4] };
      await nextUpdate(element);
      expect(input.value).to.equal('FI 2112 3456 0000 0785');
      expect(element.formattedValue).to.equal('FI 2112 3456 0000 0785');
    });

    it('should not change value when the blocks change', async () => {
      element.format = { blocks: [2, 4, 4, 4, 4] };
      await nextUpdate(element);
      expect(element.value).to.equal('FI2112345600000785');
    });

    it('should not regroup the presented text when a key is mutated in place', async () => {
      // Assigned rather than reusing `IBAN`, since the test mutates the object.
      element.format = { blocks: [4, 4, 4, 4, 2] };
      await nextUpdate(element);

      element.format.blocks = [2, 2];
      await nextUpdate(element);
      expect(input.value).to.equal('FI21 1234 5600 0007 85');
    });
  });

  describe('removing format', () => {
    let warn;

    beforeEach(async () => {
      warn = sinon.stub(console, 'warn');
      element.format = IBAN;
      element.value = 'FI2112345600000785';
      await nextUpdate(element);
    });

    afterEach(() => {
      warn.restore();
    });

    it('should present the raw value when the format is unset', async () => {
      element.format = undefined;
      await nextUpdate(element);
      expect(element.value).to.equal('FI2112345600000785');
      expect(input.value).to.equal('FI2112345600000785');
      expect(element.formattedValue).to.equal('');
    });

    it('should present the raw value when the format is invalid', async () => {
      element.format = { blocks: 'nope' };
      await nextUpdate(element);
      expect(element.value).to.equal('FI2112345600000785');
      expect(input.value).to.equal('FI2112345600000785');
      expect(element.formattedValue).to.equal('');
    });

    it('should warn once when the format is invalid', async () => {
      element.format = { blocks: 'nope' };
      await nextUpdate(element);
      expect(warn).to.be.calledOnce;
    });
  });

  describe('no format configured', () => {
    let control, controlInput;

    beforeEach(async () => {
      control = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      controlInput = control.querySelector('[slot=input]');
    });

    it('should pass the model value to the input element unchanged', async () => {
      element.value = 'FI21 1234';
      control.value = 'FI21 1234';
      await nextUpdate(element);
      await nextUpdate(control);
      expect(input.value).to.equal(controlInput.value);
      expect(input.value).to.equal('FI21 1234');
    });

    it('should pass the entered text to the model value unchanged', async () => {
      input.focus();
      await sendKeys({ type: 'FI21 1234' });
      expect(element.value).to.equal('FI21 1234');
      expect(input.value).to.equal('FI21 1234');
    });

    it('should keep formattedValue empty', async () => {
      element.value = 'FI211234';
      await nextUpdate(element);
      expect(element.formattedValue).to.equal('');
    });

    it('should move the caret to the end on a programmatic value set', async () => {
      element.value = 'FI211234';
      await nextUpdate(element);
      input.focus();
      input.setSelectionRange(2, 2);
      element.value = 'FI2112345600';
      await nextUpdate(element);
      expect(input.selectionStart).to.equal(input.value.length);
    });

    it('should map no caret to the presented value', () => {
      expect(element._mapCaretToPresentedValue(input, 'FI21 1234')).to.be.undefined;
    });
  });

  describe('properties set before attach', () => {
    let detached, detachedInput;

    beforeEach(async () => {
      detached = document.createElement(tag);
      detached.format = IBAN;
      detached.value = 'FI2112345600000785';
      document.body.appendChild(detached);
      await nextRender();
      detachedInput = detached.querySelector('[slot=input]');
    });

    afterEach(() => {
      detached.remove();
    });

    it('should present the value set before attach', () => {
      expect(detachedInput.value).to.equal('FI21 1234 5600 0007 85');
    });

    it('should have the same value and formattedValue as the after-attach case', async () => {
      element.format = IBAN;
      element.value = 'FI2112345600000785';
      await nextUpdate(element);
      expect(detached.value).to.equal(element.value);
      expect(detached.formattedValue).to.equal(element.formattedValue);
      expect(detachedInput.value).to.equal(input.value);
    });
  });
});
