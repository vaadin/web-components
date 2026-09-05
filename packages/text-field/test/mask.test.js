import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-text-field.js';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';

// +7 (000) 000-00-00
//  ^ items 0 '+', 1 '7', 2 ' ', 3 '(', 4-6 digits, 7 ')', 8 ' ', 9-11 digits,
//    12 '-', 13-14 digits, 15 '-', 16-17 digits
const PHONE_MASK = '+7 (000) 000-00-00';

// A mask from the legacy IMask based field: an escaped `0` is the character
// itself rather than a digit slot, so `\0` and `8` are laid out by the field.
const LEGACY_MASK = '*\\08\\0\\0\\0-00-**-000000-0';

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

/**
 * Dispatches the `paste` event on its own, which is the acceptance check that
 * `allowedCharPattern` runs, without performing the edit.
 */
function firePasteEvent(input, pastedText) {
  const event = new Event('paste', { bubbles: true, cancelable: true, composed: true });
  event.clipboardData = { getData: () => pastedText };
  input.dispatchEvent(event);
  return event;
}

describe('formatMask', () => {
  let field, input;

  beforeEach(async () => {
    clearWarnings();
    field = fixtureSync('<vaadin-text-field></vaadin-text-field>');
    await nextRender();
    input = field.inputElement;
  });

  describe('typing', () => {
    beforeEach(async () => {
      field.formatMask = PHONE_MASK;
      await nextUpdate(field);
      input.focus();
    });

    it('should lay the typed digits out with the mask', async () => {
      await sendKeys({ type: '9002111' });

      expect(input.value).to.equal('+7 (900) 211-1');
      expect(field.value).to.equal('9002111');
      expect(input.selectionStart).to.equal(14);
    });

    it('should mirror the presented text in formattedValue before value-changed fires', async () => {
      const seen = [];
      field.addEventListener('value-changed', () => {
        seen.push({ formattedValue: field.formattedValue, view: input.value });
      });

      await sendKeys({ type: '9002111' });

      expect(seen).to.have.lengthOf(7);
      expect(seen.at(-1)).to.eql({ formattedValue: '+7 (900) 211-1', view: '+7 (900) 211-1' });
    });

    it('should leave the text unchanged when a slot rejects the typed character', async () => {
      await sendKeys({ type: '9002111' });

      const spy = sinon.spy();
      field.addEventListener('value-changed', spy);

      await sendKeys({ press: 'x' });

      expect(input.value).to.equal('+7 (900) 211-1');
      expect(field.value).to.equal('9002111');
      expect(input.selectionStart).to.equal(14);
      expect(spy).to.not.be.called;
    });

    it('should mark the input as prevented when a slot rejects the typed character', async () => {
      await sendKeys({ type: '9002111' });
      await sendKeys({ press: 'x' });

      expect(field.hasAttribute('input-prevented')).to.be.true;
    });

    it('should consume a typed character that the mask inserts itself', async () => {
      // The caret sits after the last digit of `+7 (900) 201`, right before the
      // `-` that the mask is about to insert, so typing it adds the fixed
      // character and leaves the value alone. The `-` is not a digit, so this
      // also covers that `allowedCharPattern` lets a mask character through.
      field.allowedCharPattern = '[0-9]';
      field.value = '900201';
      await nextUpdate(field);
      input.setSelectionRange(12, 12);

      await sendKeys({ press: '-' });

      expect(input.value).to.equal('+7 (900) 201-');
      expect(field.value).to.equal('900201');
      expect(field.hasAttribute('input-prevented')).to.be.false;
    });
  });

  describe('deleting', () => {
    beforeEach(async () => {
      field.formatMask = PHONE_MASK;
      field.value = '90020111';
      await nextUpdate(field);
      expect(input.value).to.equal('+7 (900) 201-11');
      input.focus();
    });

    it('should delete the digit before the caret and lay the rest out again', async () => {
      // Caret 10 sits after the `2` of `201`, which is a digit, so the deletion
      // is the plain one: raw 90020111 -> 9000111 -> +7 (900) 011-1, caret 9.
      input.setSelectionRange(10, 10);
      await sendKeys({ press: 'Backspace' });

      expect(input.value).to.equal('+7 (900) 011-1');
      expect(field.value).to.equal('9000111');
      expect(input.selectionStart).to.equal(9);
    });

    it('should widen Backspace next to a fixed character onto the digit before it', async () => {
      // Caret 8 sits right after the `)`, so the deletion widens over it and
      // removes the digit before it, the `0` at index 6: raw 90020111 -> 9020111,
      // laid out as +7 (902) 011-1 with the caret after the `90`, at index 6.
      input.setSelectionRange(8, 8);
      await sendKeys({ press: 'Backspace' });

      expect(input.value).to.equal('+7 (902) 011-1');
      expect(field.value).to.equal('9020111');
      expect(input.selectionStart).to.equal(6);
    });

    it('should widen Delete next to a fixed character onto the digit after it', async () => {
      // Caret 12 sits right before the `-`, so the deletion widens over it and
      // removes the digit after it, the `1` at index 13: raw 90020111 -> 9002011,
      // laid out as +7 (900) 201-1 with the caret after the `-`, at index 13.
      input.setSelectionRange(12, 12);
      await sendKeys({ press: 'Delete' });

      expect(input.value).to.equal('+7 (900) 201-1');
      expect(field.value).to.equal('9002011');
      expect(input.selectionStart).to.equal(13);
    });
  });

  describe('pasting', () => {
    beforeEach(async () => {
      field.formatMask = PHONE_MASK;
      await nextUpdate(field);
      input.focus();
    });

    it('should lay a pasted string out and drop what the mask cannot hold', () => {
      paste(input, '+7 (900) 201-11-22 extra');

      expect(input.value).to.equal('+7 (900) 201-11-22');
      expect(field.value).to.equal('9002011122');
    });

    describe('allowedCharPattern', () => {
      beforeEach(async () => {
        field.allowedCharPattern = '[0-9]';
        await nextUpdate(field);
      });

      it('should accept a paste of the digits alone', () => {
        const event = firePasteEvent(input, '9002011122');

        expect(event.defaultPrevented).to.be.false;
        expect(field.hasAttribute('input-prevented')).to.be.false;
      });

      it('should accept a paste of the masked string', () => {
        const event = firePasteEvent(input, '+7 (900) 201-11-22');

        expect(event.defaultPrevented).to.be.false;
        expect(field.hasAttribute('input-prevented')).to.be.false;
      });

      it('should accept a paste of a fragment holding the characters of the mask', async () => {
        // The `) ` run only appears once a digit follows it, so three digits
        // present as `+7 (900` and the caret goes to its end, at index 7.
        field.value = '900';
        await nextUpdate(field);
        expect(input.value).to.equal('+7 (900');
        input.setSelectionRange(7, 7);

        const event = firePasteEvent(input, '201-11-22');

        expect(event.defaultPrevented).to.be.false;
        expect(field.hasAttribute('input-prevented')).to.be.false;
      });
    });
  });

  describe('programmatic value', () => {
    let warn;

    beforeEach(async () => {
      warn = sinon.stub(console, 'warn');
      field.formatMask = PHONE_MASK;
      field.value = '90020111';
      await nextUpdate(field);
    });

    afterEach(() => {
      warn.restore();
    });

    it('should keep the caret next to the same digit while the field is focused', async () => {
      input.focus();
      input.setSelectionRange(10, 10);

      field.value = '9002011122';
      await nextUpdate(field);

      expect(input.value).to.equal('+7 (900) 201-11-22');
      expect(input.selectionStart).to.equal(10);
    });

    it('should present nothing for a value that the mask rejects entirely', async () => {
      field.value = 'xyz';
      await nextUpdate(field);

      expect(input.value).to.equal('');
      expect(field.formattedValue).to.equal('');
      expect(field.value).to.equal('xyz');
      expect(warn).to.be.calledOnce;
    });

    it('should present the part of an overlong value that fits', async () => {
      field.value = '90020111223344';
      await nextUpdate(field);

      expect(input.value).to.equal('+7 (900) 201-11-22');
      expect(field.value).to.equal('90020111223344');
      expect(warn).to.be.calledOnce;
    });

    it('should take the value down to what fits on the next keystroke', async () => {
      field.value = '90020111223344';
      await nextUpdate(field);

      input.focus();
      input.setSelectionRange(18, 18);
      await sendKeys({ press: '5' });

      expect(input.value).to.equal('+7 (900) 201-11-22');
      expect(field.value).to.equal('9002011122');
    });
  });

  describe('removing the mask', () => {
    beforeEach(async () => {
      field.formatMask = PHONE_MASK;
      field.value = '9002011122';
      await nextUpdate(field);
      expect(input.value).to.equal('+7 (900) 201-11-22');
    });

    it('should present the raw value when the mask is removed', async () => {
      field.formatMask = undefined;
      await nextUpdate(field);

      expect(field._hasFormat).to.be.false;
      expect(input.value).to.equal('9002011122');
      expect(field.formattedValue).to.equal('');
      expect(field.value).to.equal('9002011122');
    });
  });

  describe('formatMask and formatBlocks', () => {
    let warn;

    beforeEach(async () => {
      warn = sinon.stub(console, 'warn');
      field.formatMask = PHONE_MASK;
      field.formatBlocks = [4, 4, 4];
      await nextUpdate(field);
      input.focus();
    });

    afterEach(() => {
      warn.restore();
    });

    it('should lay the typed digits out with the mask', async () => {
      await sendKeys({ type: '9002011122' });

      expect(input.value).to.equal('+7 (900) 201-11-22');
      expect(field.value).to.equal('9002011122');
    });

    it('should warn once that the blocks are ignored', () => {
      expect(warn).to.be.calledOnce;
    });
  });

  describe('maxlength', () => {
    beforeEach(async () => {
      field.maxlength = 5;
      field.formatMask = PHONE_MASK;
      await nextUpdate(field);
    });

    it('should not delegate the maxlength attribute while a mask is set', () => {
      expect(input.hasAttribute('maxlength')).to.be.false;
    });

    it('should be valid at the maximum number of unformatted characters', async () => {
      field.value = '90020';
      await nextUpdate(field);

      expect(field.checkValidity()).to.be.true;
    });

    it('should be invalid past the maximum number of unformatted characters', async () => {
      field.value = '900201';
      await nextUpdate(field);

      expect(field.checkValidity()).to.be.false;
    });
  });

  describe('composition', () => {
    beforeEach(async () => {
      field.formatMask = '00:00';
      await nextUpdate(field);
      input.focus();
      input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, composed: true }));
    });

    it('should leave the composed text as typed while the session is in flight', async () => {
      await sendKeys({ type: '1234' });

      expect(input.value).to.equal('1234');
      expect(field.value).to.equal('1234');
    });

    it('should lay the composed text out once the session ends', async () => {
      await sendKeys({ type: '1234' });
      input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, composed: true }));

      expect(input.value).to.equal('12:34');
      expect(field.formattedValue).to.equal('12:34');
      expect(field.value).to.equal('1234');
    });

    it('should not fire value-changed for a layout that leaves the value as it is', async () => {
      // Two digits are laid out as themselves: the `:` is only inserted before
      // the digit that follows it, so ending the session changes nothing.
      await sendKeys({ type: '12' });

      const spy = sinon.spy();
      field.addEventListener('value-changed', spy);
      input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, composed: true }));

      expect(input.value).to.equal('12');
      expect(field.value).to.equal('12');
      expect(spy).to.not.be.called;
    });
  });

  describe('input event without beforeinput', () => {
    beforeEach(async () => {
      field.formatMask = PHONE_MASK;
      await nextUpdate(field);
    });

    it('should lay out the text of an edit that fired no beforeinput event', () => {
      input.value = '+7 (900) 2x1';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

      expect(input.value).to.equal('+7 (900) 21');
      expect(field.value).to.equal('90021');
    });
  });

  describe('legacy mask', () => {
    beforeEach(async () => {
      field.formatMask = LEGACY_MASK;
      await nextUpdate(field);
      input.focus();
    });

    it('should lay the typed text out with the escaped fixed characters', async () => {
      await sendKeys({ type: 'C10476001374' });

      expect(input.value).to.equal('C08000-10-47-600137-4');
      expect(field.value).to.equal('C10476001374');
    });
  });
});
