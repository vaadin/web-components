import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { defineLit, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { InputFormatMixin } from '../src/input-format-mixin.js';

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

describe('InputFormatMixin', () => {
  const tag = defineLit(
    'input-format-mixin',
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
      class extends InputFormatMixin(InputControlMixin(PolylitMixin(Base))) {
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
      element.formatBlocks = PHONE;
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

    it('should delete the character before the delimiter on Backspace', async () => {
      input.setSelectionRange(5, 5);
      await sendKeys({ press: 'Backspace' });
      expect(element.value).to.equal('FI25678');
      expect(input.value).to.equal('FI25 678');
      expect(input.selectionStart).to.equal(3);
    });

    it('should delete the character after the delimiter on Delete and keep the caret past it', async () => {
      input.setSelectionRange(4, 4);
      await sendKeys({ press: 'Delete' });
      expect(element.value).to.equal('FI21678');
      expect(input.value).to.equal('FI21 678');
      // The caret stays next to the character that took the place of the deleted
      // one, which is the first character of the next group rather than the
      // delimiter in front of it.
      expect(input.selectionStart).to.equal(5);
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
      element.formatBlocks = IBAN;
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
      'input-format-mixin-bare',
      '<slot name="input"></slot>',
      (Base) => class extends InputFormatMixin(PolylitMixin(Base)) {},
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

  describe('format warnings', () => {
    let warn;

    beforeEach(() => {
      warn = sinon.stub(console, 'warn');
    });

    afterEach(() => {
      warn.restore();
    });

    it('should not warn when no format is configured', async () => {
      element.value = 'FI211234';
      await nextUpdate(element);
      expect(warn).to.not.be.called;
    });

    it('should not warn when only the delimiter is set', async () => {
      element.formatDelimiter = '-';
      await nextUpdate(element);
      expect(warn).to.not.be.called;
    });

    it('should not warn when only the text case is set', async () => {
      element.formatTextCase = 'upper';
      await nextUpdate(element);
      expect(warn).to.not.be.called;
    });

    it('should warn once when a block is not a positive integer', async () => {
      element.formatBlocks = [4, 0];
      await nextUpdate(element);
      expect(element._hasFormat).to.be.false;
      expect(warn).to.be.calledOnce;
    });

    it('should warn once for repeated updates with the same invalid blocks', async () => {
      element.formatBlocks = 'nope';
      await nextUpdate(element);
      element.formatBlocks = 'nope either';
      await nextUpdate(element);
      expect(warn).to.be.calledOnce;
    });

    it('should warn for the delimiter and the text case when both are invalid', async () => {
      element.formatBlocks = IBAN;
      element.formatDelimiter = '--';
      element.formatTextCase = 'title';
      await nextUpdate(element);
      expect(element._hasFormat).to.be.true;
      expect(warn).to.be.calledTwice;
    });

    it('should not warn when the delimiter and the text case are invalid without blocks', async () => {
      element.formatDelimiter = '--';
      element.formatTextCase = 'title';
      await nextUpdate(element);
      expect(warn).to.not.be.called;
    });
  });

  describe('deleting a selection', () => {
    beforeEach(async () => {
      element.formatBlocks = IBAN;
      element.value = 'FI215678';
      await nextUpdate(element);
      input.focus();
    });

    it('should remove exactly the selected range and regroup what is left', async () => {
      input.setSelectionRange(3, 6);
      await sendKeys({ press: 'Backspace' });
      expect(element.value).to.equal('FI2678');
      expect(input.value).to.equal('FI26 78');
      expect(input.selectionStart).to.equal(3);
    });

    it('should keep the value when a selection covers the delimiter alone', async () => {
      input.setSelectionRange(4, 5);
      await sendKeys({ press: 'Backspace' });
      expect(element.value).to.equal('FI215678');
      expect(input.value).to.equal('FI21 5678');
    });
  });

  describe('typing the delimiter', () => {
    beforeEach(async () => {
      element.formatBlocks = IBAN;
      element.value = 'FI211234';
      await nextUpdate(element);
      input.focus();
      input.setSelectionRange(2, 2);
    });

    it('should keep the presented text unchanged when the delimiter is typed inside a group', async () => {
      await sendKeys({ type: ' ' });
      expect(input.value).to.equal('FI21 1234');
      expect(element.value).to.equal('FI211234');
      expect(input.selectionStart).to.equal(2);
    });

    it('should not mark the input as prevented when the delimiter is typed inside a group', async () => {
      await sendKeys({ type: ' ' });
      expect(element.hasAttribute('input-prevented')).to.be.false;
    });
  });

  describe('programmatic value that does not fit', () => {
    let warn;

    beforeEach(async () => {
      warn = sinon.stub(console, 'warn');
      element.formatBlocks = IBAN;
      await nextUpdate(element);
    });

    afterEach(() => {
      warn.restore();
    });

    it('should present a value that already holds the delimiter', async () => {
      element.value = 'FI21 1234';
      await nextUpdate(element);
      expect(input.value).to.equal('FI21 1234');
      expect(element.formattedValue).to.equal('FI21 1234');
    });

    it('should keep a value that already holds the delimiter as it was assigned', async () => {
      element.value = 'FI21 1234';
      await nextUpdate(element);
      expect(element.value).to.equal('FI21 1234');
    });

    it('should warn once about a value that does not fit', async () => {
      element.value = 'FI21 1234';
      await nextUpdate(element);
      expect(warn).to.be.calledOnce;
    });

    it('should not warn about a value that fits', async () => {
      element.value = 'FI211234';
      await nextUpdate(element);
      expect(warn).to.not.be.called;
    });
  });

  describe('formatMask', () => {
    beforeEach(async () => {
      element.formatMask = '00:00';
      await nextUpdate(element);
      input.focus();
    });

    it('should lay the typed text out with the mask', async () => {
      await sendKeys({ type: '1234' });
      expect(input.value).to.equal('12:34');
      expect(element.formattedValue).to.equal('12:34');
    });

    it('should keep value without the characters that the mask inserts', async () => {
      await sendKeys({ type: '1234' });
      expect(element.value).to.equal('1234');
    });

    it('should consume a typed character that the mask inserts itself', async () => {
      await sendKeys({ type: '12:34' });
      expect(input.value).to.equal('12:34');
      expect(element.value).to.equal('1234');
    });

    it('should not mark the input as prevented for a character that the mask inserts', async () => {
      await sendKeys({ type: '12:' });
      expect(element.hasAttribute('input-prevented')).to.be.false;
    });

    it('should drop a character that its slot does not accept', async () => {
      await sendKeys({ type: '1x2' });
      expect(input.value).to.equal('12');
      expect(element.value).to.equal('12');
    });

    it('should mark the input as prevented for a character that its slot does not accept', async () => {
      await sendKeys({ type: 'x' });
      expect(element.hasAttribute('input-prevented')).to.be.true;
    });

    it('should truncate the text past the last slot of the mask', async () => {
      await sendKeys({ type: '12345' });
      expect(input.value).to.equal('12:34');
      expect(element.value).to.equal('1234');
    });

    it('should delete the character before a fixed one on Backspace', async () => {
      await sendKeys({ type: '1234' });
      input.setSelectionRange(3, 3);
      await sendKeys({ press: 'Backspace' });
      expect(input.value).to.equal('13:4');
      expect(element.value).to.equal('134');
      expect(input.selectionStart).to.equal(1);
    });

    it('should present a value set programmatically in its masked form', async () => {
      element.value = '1234';
      await nextUpdate(element);
      expect(input.value).to.equal('12:34');
      expect(element.formattedValue).to.equal('12:34');
    });

    it('should present the raw value when the mask is removed', async () => {
      element.value = '1234';
      await nextUpdate(element);
      element.formatMask = '';
      await nextUpdate(element);
      expect(element._hasFormat).to.be.false;
      expect(input.value).to.equal('1234');
      expect(element.formattedValue).to.equal('');
    });

    it('should lay out a mask with several fixed characters in a row', async () => {
      element.formatMask = '(000) 000-0000';
      await nextUpdate(element);
      await sendKeys({ type: '5551234567' });
      expect(input.value).to.equal('(555) 123-4567');
      expect(element.value).to.equal('5551234567');
    });

    it('should accept a pasted string that holds the characters of the mask', async () => {
      element.formatMask = '(000) 000-0000';
      element.allowedCharPattern = '[0-9]';
      await nextUpdate(element);
      expect(element._shouldAcceptText('(555) 123-4567')).to.be.true;
    });

    it('should lay a typed digit of another script out as the ASCII digit', async () => {
      await sendKeys({ type: '٣' });
      expect(input.value).to.equal('3');
      expect(element.value).to.equal('3');
      await sendKeys({ type: '۵' });
      expect(input.value).to.equal('35');
    });

    it('should lay typed digits of another script out as the ASCII digits without a fixed character', async () => {
      // Without a fixed character the typed text already fits the mask, so this only
      // holds because the early return of the layout tests for the ASCII digits too.
      element.formatMask = '0000';
      await nextUpdate(element);
      await sendKeys({ type: '٣٤٥٦' });
      expect(input.value).to.equal('3456');
      expect(element.value).to.equal('3456');
    });

    it('should mark the input as prevented for a digit of another script in a letter slot', async () => {
      element.formatMask = 'aa-00';
      await nextUpdate(element);
      await sendKeys({ type: '٣' });
      expect(input.value).to.equal('');
      expect(element.hasAttribute('input-prevented')).to.be.true;
    });
  });

  describe('programmatic value with digits of another script', () => {
    let warn;

    beforeEach(async () => {
      warn = sinon.stub(console, 'warn');
      element.formatMask = '0000';
      await nextUpdate(element);
      element.value = '٣٤٥٦';
      await nextUpdate(element);
    });

    afterEach(() => {
      warn.restore();
    });

    it('should present the value with the ASCII digits', () => {
      expect(input.value).to.equal('3456');
      expect(element.formattedValue).to.equal('3456');
    });

    it('should keep the value as it was assigned', () => {
      expect(element.value).to.equal('٣٤٥٦');
    });

    it('should not warn, since every character of the value is laid out', () => {
      expect(warn).to.not.be.called;
    });
  });

  describe('formatMask with optional sections', () => {
    beforeEach(async () => {
      element.formatMask = '00000[-0000]';
      await nextUpdate(element);
      input.focus();
    });

    it('should lay the typed text out without the section until it is typed into', async () => {
      await sendKeys({ type: '12345' });
      expect(input.value).to.equal('12345');
      expect(element.value).to.equal('12345');
      expect(input.selectionStart).to.equal(5);
    });

    it('should not present the fixed characters of the section before it is typed into', async () => {
      await sendKeys({ type: '12345' });
      expect(element.formattedValue).to.equal('12345');
    });

    it('should lay the section out once the user types into it', async () => {
      await sendKeys({ type: '123456' });
      expect(input.value).to.equal('12345-6');
      expect(element.value).to.equal('123456');
      expect(input.selectionStart).to.equal(7);
    });

    it('should drop the section on Backspace over its first slot', async () => {
      await sendKeys({ type: '123456' });
      await sendKeys({ press: 'Backspace' });
      expect(input.value).to.equal('12345');
      expect(element.value).to.equal('12345');
      expect(input.selectionStart).to.equal(5);
    });

    it('should delete the character before the fixed one of the section on Backspace', async () => {
      await sendKeys({ type: '123456' });
      input.setSelectionRange(6, 6);
      await sendKeys({ press: 'Backspace' });
      expect(input.value).to.equal('12346');
      expect(element.value).to.equal('12346');
      expect(input.selectionStart).to.equal(4);
    });

    it('should lay a pasted string out in the expansion that holds it', () => {
      paste(input, '123456789');
      expect(input.value).to.equal('12345-6789');
      expect(element.value).to.equal('123456789');
    });

    it('should truncate the text past the last slot of the maximal expansion', async () => {
      paste(input, '123456789');
      await sendKeys({ type: '0' });
      expect(input.value).to.equal('12345-6789');
      expect(element.value).to.equal('123456789');
      expect(element.hasAttribute('input-prevented')).to.be.true;
    });

    it('should enable two sections one at a time', async () => {
      element.formatMask = '00[-00][-00]';
      await nextUpdate(element);
      const views = ['1', '12', '12-3', '12-34', '12-34-5', '12-34-56'];
      const values = ['1', '12', '123', '1234', '12345', '123456'];

      for (const [index, digit] of [...'123456'].entries()) {
        await sendKeys({ type: digit });
        expect(input.value).to.equal(views[index]);
        expect(element.value).to.equal(values[index]);
      }
    });

    it('should drop the second of two sections on Backspace over its first slot', async () => {
      element.formatMask = '00[-00][-00]';
      await nextUpdate(element);
      await sendKeys({ type: '12345' });
      await sendKeys({ press: 'Backspace' });
      expect(input.value).to.equal('12-34');
      expect(element.value).to.equal('1234');
      expect(input.selectionStart).to.equal(5);
    });
  });

  describe('formatMask and formatBlocks', () => {
    let warn;

    beforeEach(async () => {
      warn = sinon.stub(console, 'warn');
      element.formatMask = '00:00';
      element.formatBlocks = [4, 4];
      await nextUpdate(element);
      input.focus();
    });

    afterEach(() => {
      warn.restore();
    });

    it('should lay the value out with the mask', async () => {
      await sendKeys({ type: '1234' });
      expect(input.value).to.equal('12:34');
      expect(element.value).to.equal('1234');
    });

    it('should warn once that the blocks are ignored', () => {
      expect(warn).to.be.calledOnce;
    });

    it('should group with the blocks again when the mask is removed', async () => {
      element.formatMask = undefined;
      await nextUpdate(element);
      await sendKeys({ type: '1234' });
      expect(input.value).to.equal('1234');
      await sendKeys({ type: '5' });
      expect(input.value).to.equal('1234 5');
    });
  });
});
