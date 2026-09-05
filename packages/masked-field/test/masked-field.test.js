import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-masked-field.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.maskedFieldComponent = true;

const IBAN = [4, 4, 4, 4, 2];
const RAW_IBAN = 'FI2112345600000785';
const FORMATTED_IBAN = 'FI21 1234 5600 0007 85';

const fireDropEvent = (input, draggedText) => {
  const event = new Event('drop', { bubbles: true, cancelable: true, composed: true });
  event.dataTransfer = { getData: () => draggedText };
  input.dispatchEvent(event);
  return event;
};

const firePasteEvent = (input, pastedText) => {
  const event = new Event('paste', { bubbles: true, cancelable: true, composed: true });
  event.clipboardData = { getData: () => pastedText };
  input.dispatchEvent(event);
  return event;
};

const fireBeforeInputEvent = (input, textToInput) => {
  const event = new Event('beforeinput', { bubbles: true, cancelable: true, composed: true });
  event.inputType = 'insertFromPaste';
  event.data = textToInput;
  input.dispatchEvent(event);
  return event;
};

describe('format', () => {
  let field, input;

  beforeEach(async () => {
    field = fixtureSync('<vaadin-masked-field></vaadin-masked-field>');
    await nextRender();
    input = field.inputElement;
  });

  describe('presentation', () => {
    it('should group the typed value once a format is set', async () => {
      field.formatBlocks = IBAN;
      await nextUpdate(field);

      input.focus();
      await sendKeys({ type: RAW_IBAN });

      expect(input.value).to.equal(FORMATTED_IBAN);
      expect(field.formattedValue).to.equal(FORMATTED_IBAN);
      expect(field.value).to.equal(RAW_IBAN);
    });

    it('should group the value with the format set as attributes', async () => {
      const element = fixtureSync(
        `<vaadin-masked-field format-blocks='[4,4,4,4,2]' format-delimiter=" "></vaadin-masked-field>`,
      );
      await nextRender();

      element.value = RAW_IBAN;
      await nextUpdate(element);

      expect(element.inputElement.value).to.equal(FORMATTED_IBAN);
      expect(element.formattedValue).to.equal(FORMATTED_IBAN);
      expect(element.value).to.equal(RAW_IBAN);
    });

    it('should expose the unformatted value to a host input listener', async () => {
      field.formatBlocks = IBAN;
      await nextUpdate(field);

      const seen = [];
      field.addEventListener('input', () => {
        seen.push({ value: field.value, formattedValue: field.formattedValue, view: input.value });
      });

      input.focus();
      await sendKeys({ type: 'FI211234' });

      expect(seen).to.have.lengthOf(8);
      expect(seen.at(-1)).to.eql({ value: 'FI211234', formattedValue: 'FI21 1234', view: 'FI21 1234' });
    });

    it('should keep the caret at the end of the value on a programmatic set with no format', async () => {
      field.value = RAW_IBAN;
      await nextUpdate(field);

      input.focus();
      input.setSelectionRange(3, 3);

      field.value = 'AB1234';
      await nextUpdate(field);

      expect(input.value).to.equal('AB1234');
      expect(input.selectionStart).to.equal(6);
      expect(field.formattedValue).to.equal('');
    });
  });

  describe('clear button', () => {
    beforeEach(async () => {
      field.clearButtonVisible = true;
      field.formatBlocks = IBAN;
      field.value = RAW_IBAN;
      await nextUpdate(field);
    });

    it('should clear the value and the presentation on clear button click', async () => {
      field.$.clearButton.click();
      await nextUpdate(field);

      expect(field.value).to.equal('');
      expect(field.formattedValue).to.equal('');
      expect(input.value).to.equal('');
      expect(field.hasAttribute('has-value')).to.be.false;
    });
  });

  describe('allowedCharPattern', () => {
    beforeEach(async () => {
      field.allowedCharPattern = '[A-Z0-9]';
      field.formatBlocks = IBAN;
      await nextUpdate(field);
    });

    it('should prevent a character that the pattern rejects', async () => {
      input.focus();
      await sendKeys({ type: 'FI21' });

      const spy = sinon.spy();
      field.addEventListener('input', spy);

      await sendKeys({ press: '-' });

      expect(spy).to.not.be.called;
      expect(field.value).to.equal('FI21');
      expect(input.value).to.equal('FI21');
      expect(field.hasAttribute('input-prevented')).to.be.true;
    });

    it('should accept a paste of the formatted value', () => {
      const event = firePasteEvent(input, FORMATTED_IBAN);

      expect(event.defaultPrevented).to.be.false;
      expect(field.hasAttribute('input-prevented')).to.be.false;
    });

    it('should accept a drop of the formatted value', () => {
      const event = fireDropEvent(input, FORMATTED_IBAN);

      expect(event.defaultPrevented).to.be.false;
      expect(field.hasAttribute('input-prevented')).to.be.false;
    });

    it('should accept a beforeinput event carrying the formatted value', () => {
      const event = fireBeforeInputEvent(input, FORMATTED_IBAN);

      expect(event.defaultPrevented).to.be.false;
      expect(field.hasAttribute('input-prevented')).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      field.required = true;
      field.formatBlocks = IBAN;
      await nextUpdate(field);
    });

    it('should be invalid when the value is empty', () => {
      expect(field.checkValidity()).to.be.false;
    });

    it('should be valid when the value is not empty', async () => {
      field.value = RAW_IBAN;
      await nextUpdate(field);

      expect(field.checkValidity()).to.be.true;
    });
  });

  describe('pattern', () => {
    beforeEach(async () => {
      field.pattern = '[A-Z]{2}\\d{16}';
      field.formatBlocks = IBAN;
      await nextUpdate(field);
    });

    it('should not delegate the pattern attribute while a format is set', () => {
      expect(input.hasAttribute('pattern')).to.be.false;
    });

    it('should delegate the pattern attribute again when the format is removed', async () => {
      field.formatBlocks = undefined;
      await nextUpdate(field);

      expect(input.getAttribute('pattern')).to.equal('[A-Z]{2}\\d{16}');
    });

    it('should match the pattern against the unformatted value', async () => {
      field.value = RAW_IBAN;
      await nextUpdate(field);

      expect(field.checkValidity()).to.be.true;
    });

    it('should be invalid when the unformatted value does not match the pattern', async () => {
      field.value = 'FI21123456000007';
      await nextUpdate(field);

      expect(field.checkValidity()).to.be.false;
    });
  });

  describe('maxlength', () => {
    beforeEach(async () => {
      field.maxlength = 18;
      field.formatBlocks = IBAN;
      await nextUpdate(field);
    });

    it('should not delegate the maxlength attribute while a format is set', () => {
      expect(input.hasAttribute('maxlength')).to.be.false;
    });

    it('should allow typing the full formatted value', async () => {
      input.focus();
      await sendKeys({ type: RAW_IBAN });

      expect(input.value).to.equal(FORMATTED_IBAN);
      expect(field.value).to.equal(RAW_IBAN);
      expect(field.checkValidity()).to.be.true;
    });

    it('should be invalid past the maximum number of unformatted characters', async () => {
      input.focus();
      await sendKeys({ type: RAW_IBAN });
      await sendKeys({ press: '9' });

      expect(field.value).to.equal(`${RAW_IBAN}9`);
      expect(field.checkValidity()).to.be.false;
    });
  });

  describe('minlength', () => {
    beforeEach(async () => {
      field.minlength = 18;
      field.formatBlocks = IBAN;
      await nextUpdate(field);
    });

    it('should not delegate the minlength attribute while a format is set', () => {
      expect(input.hasAttribute('minlength')).to.be.false;
    });

    it('should be valid when the value is empty', () => {
      expect(field.checkValidity()).to.be.true;
    });

    it('should be invalid below the minimum number of unformatted characters', async () => {
      field.value = 'FI211234';
      await nextUpdate(field);

      expect(field.checkValidity()).to.be.false;
    });
  });

  describe('re-validation on format change', () => {
    let spy;

    beforeEach(async () => {
      field.maxlength = 18;
      field.value = FORMATTED_IBAN;
      await nextUpdate(field);

      spy = sinon.spy();
      field.addEventListener('validated', spy);
    });

    it('should re-validate against the value when the format is set', async () => {
      // The native constraint does not apply to a value that the user has not
      // edited, so the field starts out valid with the delimiters in its value.
      expect(field.checkValidity()).to.be.true;

      field.formatBlocks = IBAN;
      await nextUpdate(field);

      expect(field.value).to.equal(FORMATTED_IBAN);
      expect(field.checkValidity()).to.be.false;
      expect(field.invalid).to.be.true;
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.valid).to.be.false;
    });

    it('should re-validate against the input element when the format is removed', async () => {
      field.formatBlocks = IBAN;
      await nextUpdate(field);
      spy.resetHistory();

      field.formatBlocks = undefined;
      await nextUpdate(field);

      expect(field.value).to.equal(FORMATTED_IBAN);
      expect(field.checkValidity()).to.be.true;
      expect(field.invalid).to.be.false;
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.valid).to.be.true;
    });
  });

  describe('barred from constraint validation', () => {
    beforeEach(async () => {
      field.required = true;
      await nextUpdate(field);
    });

    it('should report a readonly field as valid with and without a format', async () => {
      field.readonly = true;
      await nextUpdate(field);
      expect(field.checkValidity()).to.be.true;

      field.formatBlocks = IBAN;
      await nextUpdate(field);
      expect(field.checkValidity()).to.be.true;
    });

    it('should report a disabled field as valid with and without a format', async () => {
      field.disabled = true;
      await nextUpdate(field);
      expect(field.checkValidity()).to.be.true;

      field.formatBlocks = IBAN;
      await nextUpdate(field);
      expect(field.checkValidity()).to.be.true;
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      field.addEventListener('change', spy);
    });

    it('should fire change on blur after an edit that the format applied itself', async () => {
      // The text case makes every keystroke go through a script write, which is
      // what removes the browser's own basis for firing `change`.
      field.formatBlocks = IBAN;
      field.formatTextCase = 'upper';
      field.value = 'FI2112345';
      await nextUpdate(field);
      expect(input.value).to.equal('FI21 1234 5');

      input.focus();
      input.setSelectionRange(5, 5);
      await sendKeys({ press: 'Backspace' });
      await nextUpdate(field);

      input.blur();

      expect(field.value).to.equal('FI212345');
      expect(input.value).to.equal('FI21 2345');
      expect(spy).to.be.calledOnce;
    });

    it('should fire change once on blur after typing a formatted value', async () => {
      // The text case makes every keystroke go through a script write, which is
      // what removes the browser's own basis for firing `change`.
      field.formatBlocks = IBAN;
      field.formatTextCase = 'upper';
      await nextUpdate(field);

      input.focus();
      await sendKeys({ type: 'fi2112345' });
      await nextUpdate(field);

      input.blur();

      expect(field.value).to.equal('FI2112345');
      expect(spy).to.be.calledOnce;
    });

    it('should fire change once on blur after typing without a format', async () => {
      input.focus();
      await sendKeys({ type: 'abc' });
      await nextUpdate(field);

      input.blur();

      expect(field.value).to.equal('abc');
      expect(spy).to.be.calledOnce;
    });

    it('should not fire change on blur after a programmatic value set without a format', async () => {
      input.focus();
      field.value = 'x';
      await nextUpdate(field);

      input.blur();

      expect(spy).to.be.not.called;
    });
  });
});
