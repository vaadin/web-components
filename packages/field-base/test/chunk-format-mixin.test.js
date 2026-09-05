import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { defineLit, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import { ChunkFormatMixin } from '../src/chunk-format-mixin.js';
import { InputControlMixin } from '../src/input-control-mixin.js';
import { InputController } from '../src/input-controller.js';

const IBAN = [4, 4, 4, 4, 2];
const PHONE = [3, 3, 4];

const FORMATTED_IBAN = 'FI21 1234 5600 0007 85';
const UNFORMATTED_IBAN = 'FI2112345600000785';
// Seven characters longer than the eighteen the IBAN format describes.
const OVERLONG_IBAN = 'FI2112345600000785ABCDEFG';

/**
 * Emulates what the browser does for a paste: a cancelable `beforeinput`
 * carrying the pasted text, then, unless it was prevented, the edit itself
 * and the `input` event dispatched for it.
 */
function paste(input, text) {
  const options = { inputType: 'insertFromPaste', data: text, bubbles: true, composed: true };

  if (!input.dispatchEvent(new InputEvent('beforeinput', { ...options, cancelable: true }))) {
    return;
  }

  input.setRangeText(text, input.selectionStart, input.selectionEnd, 'end');
  input.dispatchEvent(new InputEvent('input', options));
}

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
      element.formatBlocks = IBAN;
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
      element.formatBlocks = PHONE;
      await nextUpdate(element);
      await sendKeys({ type: '5551234567' });
      expect(input.value).to.equal('555 123 4567');
      expect(element.value).to.equal('5551234567');
    });

    it('should use the configured delimiter', async () => {
      element.formatBlocks = [3, 3, 4];
      element.formatDelimiter = '-';
      await nextUpdate(element);
      await sendKeys({ type: '5551234567' });
      expect(input.value).to.equal('555-123-4567');
      expect(element.value).to.equal('5551234567');
    });

    it('should apply the configured text case to the presented text', async () => {
      element.formatBlocks = [4, 4];
      element.formatTextCase = 'upper';
      await nextUpdate(element);
      await sendKeys({ type: 'fi211234' });
      expect(input.value).to.equal('FI21 1234');
    });

    it('should apply the configured text case to the value', async () => {
      element.formatBlocks = [4, 4];
      element.formatTextCase = 'upper';
      await nextUpdate(element);
      await sendKeys({ type: 'fi211234' });
      expect(element.value).to.equal('FI211234');
    });
  });

  describe('format set as attribute', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} format-blocks='[4,4]'></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
      input.focus();
    });

    it('should parse the blocks from the JSON attribute', async () => {
      await sendKeys({ type: 'FI211234' });
      expect(input.value).to.equal('FI21 1234');
      expect(element.value).to.equal('FI211234');
    });
  });

  describe('caret while typing', () => {
    beforeEach(async () => {
      element.formatBlocks = IBAN;
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
      element.formatBlocks = IBAN;
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
      expect(input.value).to.equal('FI25 678');
      expect(input.selectionStart).to.equal(3);
    });

    it('should delete the character after the delimiter on Delete', async () => {
      input.setSelectionRange(4, 4);
      await sendKeys({ press: 'Delete' });
      expect(element.value).to.equal('FI21678');
      expect(input.value).to.equal('FI21 678');
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

    it('should regroup the presented text after a widened deletion', async () => {
      input.setSelectionRange(5, 5);
      await sendKeys({ press: 'Backspace' });
      expect(input.value).to.equal('FI25 678');
      expect(element.formattedValue).to.equal('FI25 678');
    });

    it('should keep the regrouped text consistent on the next insertion', async () => {
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
  });

  describe('pasting', () => {
    beforeEach(async () => {
      element.formatBlocks = IBAN;
      await nextUpdate(element);
      input.focus();
    });

    it('should group a formatted string pasted into an empty field', () => {
      paste(input, FORMATTED_IBAN);
      expect(element.value).to.equal('FI2112345600000785');
      expect(element.formattedValue).to.equal('FI21 1234 5600 0007 85');
      expect(input.selectionStart).to.equal(22);
    });

    it('should group an unformatted string pasted into an empty field', () => {
      paste(input, UNFORMATTED_IBAN);
      expect(element.value).to.equal('FI2112345600000785');
      expect(element.formattedValue).to.equal('FI21 1234 5600 0007 85');
      expect(input.selectionStart).to.equal(22);
    });

    it('should keep the overflow of an over-long string pasted into an empty field', () => {
      paste(input, OVERLONG_IBAN);
      expect(element.value).to.equal('FI2112345600000785ABCDEFG');
      expect(element.formattedValue).to.equal('FI21 1234 5600 0007 85 ABCDEFG');
      expect(input.selectionStart).to.equal(30);
    });

    it('should regroup the whole field around a formatted string pasted in the middle', async () => {
      element.value = 'FI211234';
      await nextUpdate(element);
      input.setSelectionRange(2, 2);
      paste(input, FORMATTED_IBAN);
      expect(element.value).to.equal('FIFI2112345600000785211234');
      expect(element.formattedValue).to.equal('FIFI 2112 3456 0000 07 85211234');
      expect(input.selectionStart).to.equal(25);
    });

    it('should regroup the whole field around an unformatted string pasted in the middle', async () => {
      element.value = 'FI211234';
      await nextUpdate(element);
      input.setSelectionRange(2, 2);
      paste(input, UNFORMATTED_IBAN);
      expect(element.value).to.equal('FIFI2112345600000785211234');
      expect(element.formattedValue).to.equal('FIFI 2112 3456 0000 07 85211234');
      expect(input.selectionStart).to.equal(25);
    });

    it('should move the caret past a delimiter that the paste pushed in front of it', async () => {
      element.value = UNFORMATTED_IBAN;
      await nextUpdate(element);
      input.setSelectionRange(0, 0);
      paste(input, 'ABCD');
      expect(element.formattedValue).to.equal('ABCD FI21 1234 5600 00 0785');
      expect(input.selectionStart).to.equal(5);
    });

    it('should keep the overflow of an over-long string pasted in the middle', async () => {
      element.value = 'FI211234';
      await nextUpdate(element);
      input.setSelectionRange(2, 2);
      paste(input, OVERLONG_IBAN);
      expect(element.value).to.equal('FIFI2112345600000785ABCDEFG211234');
      expect(element.formattedValue).to.equal('FIFI 2112 3456 0000 07 85ABCDEFG211234');
      expect(input.selectionStart).to.equal(32);
    });
  });

  describe('pasting under allowedCharPattern', () => {
    beforeEach(async () => {
      element.formatBlocks = IBAN;
      element.allowedCharPattern = '[A-Z0-9]';
      await nextUpdate(element);
    });

    function fireBeforeInput(data) {
      const event = new InputEvent('beforeinput', {
        inputType: 'insertFromPaste',
        data,
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      input.dispatchEvent(event);
      return event;
    }

    function firePaste(text) {
      const event = new Event('paste', { bubbles: true, cancelable: true, composed: true });
      event.clipboardData = { getData: () => text };
      input.dispatchEvent(event);
      return event;
    }

    function fireDrop(text) {
      const event = new Event('drop', { bubbles: true, cancelable: true, composed: true });
      event.dataTransfer = { getData: () => text };
      input.dispatchEvent(event);
      return event;
    }

    it('should not prevent a beforeinput carrying a formatted string', () => {
      expect(fireBeforeInput(FORMATTED_IBAN).defaultPrevented).to.be.false;
      expect(element.hasAttribute('input-prevented')).to.be.false;
    });

    it('should not prevent a paste carrying a formatted string', () => {
      expect(firePaste(FORMATTED_IBAN).defaultPrevented).to.be.false;
      expect(element.hasAttribute('input-prevented')).to.be.false;
    });

    it('should not prevent a drop carrying a formatted string', () => {
      expect(fireDrop(FORMATTED_IBAN).defaultPrevented).to.be.false;
      expect(element.hasAttribute('input-prevented')).to.be.false;
    });

    it('should prevent a beforeinput carrying a character the pattern rejects', () => {
      // The hyphen is not the delimiter, so unformatting leaves it in place.
      expect(fireBeforeInput('FI21-1234').defaultPrevented).to.be.true;
      expect(element.hasAttribute('input-prevented')).to.be.true;
    });

    it('should prevent a paste carrying a character the pattern rejects', () => {
      expect(firePaste('FI21-1234').defaultPrevented).to.be.true;
      expect(element.hasAttribute('input-prevented')).to.be.true;
    });
  });

  describe('composition', () => {
    beforeEach(async () => {
      // The text case makes the reformat observable: the composed text is presented
      // exactly as typed until the session ends, and uppercased afterwards.
      element.formatBlocks = [4, 4, 4, 4, 2];
      element.formatTextCase = 'upper';
      await nextUpdate(element);
      input.focus();
      input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, composed: true }));
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should leave the composed text as typed while the session is in flight', async () => {
      await sendKeys({ type: 'fi21' });
      expect(input.value).to.equal('fi21');
    });

    it('should update value while the session is in flight', async () => {
      await sendKeys({ type: 'fi21' });
      expect(element.value).to.equal('FI21');
    });

    it('should format the composed text once the session ends', async () => {
      await sendKeys({ type: 'fi21' });
      input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, composed: true }));
      expect(input.value).to.equal('FI21');
      expect(element.formattedValue).to.equal('FI21');
    });

    it('should format the composed text exactly once', async () => {
      const spy = sinon.spy(element, '_formatOnInput');
      await sendKeys({ type: 'fi21' });
      input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, composed: true }));
      expect(spy).to.be.calledOnce;
    });
  });

  describe('programmatic value', () => {
    beforeEach(async () => {
      element.formatBlocks = IBAN;
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
      element.formatBlocks = IBAN;
      element.value = 'FI2112345600000785';
      await nextUpdate(element);
    });

    it('should regroup the presented text when the blocks change', async () => {
      element.formatBlocks = [2, 4, 4, 4, 4];
      await nextUpdate(element);
      expect(input.value).to.equal('FI 2112 3456 0000 0785');
      expect(element.formattedValue).to.equal('FI 2112 3456 0000 0785');
    });

    it('should not change value when the blocks change', async () => {
      element.formatBlocks = [2, 4, 4, 4, 4];
      await nextUpdate(element);
      expect(element.value).to.equal('FI2112345600000785');
    });

    it('should not regroup the presented text when the blocks are mutated in place', async () => {
      // Assigned rather than reusing `IBAN`, since the test mutates the array.
      element.formatBlocks = [4, 4, 4, 4, 2];
      await nextUpdate(element);

      element.formatBlocks[0] = 2;
      await nextUpdate(element);
      expect(input.value).to.equal('FI21 1234 5600 0007 85');
    });
  });

  describe('invalid or removed format', () => {
    let warn;

    beforeEach(async () => {
      warn = sinon.stub(console, 'warn');
      element.formatBlocks = IBAN;
      element.value = 'FI2112345600000785';
      await nextUpdate(element);
    });

    afterEach(() => {
      warn.restore();
    });

    it('should present the raw value when the blocks are unset', async () => {
      element.formatBlocks = undefined;
      await nextUpdate(element);
      expect(element.value).to.equal('FI2112345600000785');
      expect(input.value).to.equal('FI2112345600000785');
      expect(element.formattedValue).to.equal('');
    });

    it('should present the raw value when the blocks are set to null', async () => {
      element.formatBlocks = null;
      await nextUpdate(element);
      expect(element.value).to.equal('FI2112345600000785');
      expect(input.value).to.equal('FI2112345600000785');
      expect(element.formattedValue).to.equal('');
    });

    it('should present the raw value when the blocks are emptied', async () => {
      element.formatBlocks = [];
      await nextUpdate(element);
      expect(element.value).to.equal('FI2112345600000785');
      expect(input.value).to.equal('FI2112345600000785');
      expect(element.formattedValue).to.equal('');
    });

    it('should present the raw value when the blocks are invalid', async () => {
      element.formatBlocks = 'nope';
      await nextUpdate(element);
      expect(element.value).to.equal('FI2112345600000785');
      expect(input.value).to.equal('FI2112345600000785');
      expect(element.formattedValue).to.equal('');
    });

    it('should warn once when the blocks are invalid', async () => {
      element.formatBlocks = 'nope';
      await nextUpdate(element);
      expect(warn).to.be.calledOnce;
    });

    it('should group with a space and warn once when the delimiter is invalid', async () => {
      element.formatDelimiter = '--';
      await nextUpdate(element);
      expect(input.value).to.equal('FI21 1234 5600 0007 85');
      expect(element.formattedValue).to.equal('FI21 1234 5600 0007 85');
      expect(warn).to.be.calledOnce;
    });

    it('should group without a case and warn once when the text case is invalid', async () => {
      element.formatTextCase = 'title';
      await nextUpdate(element);
      expect(input.value).to.equal('FI21 1234 5600 0007 85');
      expect(element.formattedValue).to.equal('FI21 1234 5600 0007 85');
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

    it('should not present a format when only the delimiter is set', async () => {
      element.formatDelimiter = '-';
      element.value = 'FI211234';
      await nextUpdate(element);
      expect(element._hasFormat).to.be.false;
      expect(input.value).to.equal('FI211234');
      expect(element.formattedValue).to.equal('');
    });

    it('should not present a format when only the text case is set', async () => {
      element.formatTextCase = 'upper';
      element.value = 'fi211234';
      await nextUpdate(element);
      expect(element._hasFormat).to.be.false;
      expect(input.value).to.equal('fi211234');
      expect(element.formattedValue).to.equal('');
    });
  });

  describe('properties set before attach', () => {
    let detached, detachedInput;

    beforeEach(async () => {
      detached = document.createElement(tag);
      detached.formatBlocks = IBAN;
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
      element.formatBlocks = IBAN;
      element.value = 'FI2112345600000785';
      await nextUpdate(element);
      expect(detached.value).to.equal(element.value);
      expect(detached.formattedValue).to.equal(element.formattedValue);
      expect(detachedInput.value).to.equal(input.value);
    });
  });

  describe('without InputControlMixin', () => {
    const bareTag = defineLit(
      'chunk-format-mixin-bare',
      '<slot name="input"></slot>',
      (Base) => class extends ChunkFormatMixin(PolylitMixin(Base)) {},
    );

    let bare, bareInput;

    beforeEach(async () => {
      bare = fixtureSync(`<${bareTag}></${bareTag}>`);
      await nextRender();
      bareInput = document.createElement('input');
      bareInput.setAttribute('slot', 'input');
      bare.appendChild(bareInput);
      bare._setInputElement(bareInput);
      bare.formatBlocks = IBAN;
      await nextUpdate(bare);
      bareInput.focus();
    });

    it('should group the typed text without the control layer below', async () => {
      await sendKeys({ type: 'FI2112345600000785' });
      expect(bareInput.value).to.equal('FI21 1234 5600 0007 85');
      expect(bare.value).to.equal('FI2112345600000785');
    });

    it('should accept any text when no acceptance predicate is inherited', () => {
      expect(bare._shouldAcceptText('FI21 1234')).to.be.true;
      expect(bare._shouldAcceptText('anything')).to.be.true;
    });

    it('should accept any text when no format is configured', async () => {
      bare.formatBlocks = undefined;
      await nextUpdate(bare);
      expect(bare._shouldAcceptText('anything')).to.be.true;
    });

    it('should leave a delete intent to the browser', () => {
      bareInput.value = 'FI21 5678';
      bareInput.setSelectionRange(5, 5);
      const event = new InputEvent('beforeinput', {
        inputType: 'deleteContentBackward',
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      bareInput.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.false;
      expect(bareInput.value).to.equal('FI21 5678');
    });

    it('should leave a paste to the browser', () => {
      const event = new Event('paste', { bubbles: true, cancelable: true, composed: true });
      event.clipboardData = { getData: () => FORMATTED_IBAN };
      bareInput.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.false;
      expect(bare.hasAttribute('input-prevented')).to.be.false;
    });
  });
});
