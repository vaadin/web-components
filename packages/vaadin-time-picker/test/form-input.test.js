import { expect } from '@esm-bundle/chai';
import { fixture, html } from '@open-wc/testing-helpers';
import { TimePickerElement } from '../src/vaadin-time-picker.js';

class TimePicker20Element extends TimePickerElement {
  checkValidity() {
    return this.value === '20:00';
  }
}

customElements.define('vaadin-time-picker-20', TimePicker20Element);

describe('form input', () => {
  let timePicker, inputElement;

  function inputValue(value) {
    const input = inputElement.inputElement;
    input.value = value;
    input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
  }

  function blurInput() {
    timePicker.__dropdownElement.dispatchEvent(new CustomEvent('focusout', { bubbles: true, composed: true }));
  }

  describe('default validator', () => {
    beforeEach(async () => {
      timePicker = await fixture(html`<vaadin-time-picker></vaadin-time-picker>`);
      inputElement = timePicker.__inputElement;
    });

    it('should pass the name to input element', () => {
      timePicker.name = 'foo';
      expect(inputElement.name).to.equal('foo');
    });

    it('should have no name by default', () => {
      expect(inputElement.name).to.be.undefined;
    });

    it('should pass required tp input element', () => {
      timePicker.required = true;
      expect(inputElement.required).to.be.true;
    });

    it('should not be required by default', () => {
      expect(inputElement.required).to.be.false;
    });

    it('should have synced invalid property with input on validation with required flag', () => {
      timePicker.name = 'foo';
      timePicker.required = true;
      timePicker.min = '14:00';
      timePicker.value = '13:00';
      timePicker.__dropdownElement.dispatchEvent(new CustomEvent('change', { bubbles: true }));

      expect(inputElement.invalid).to.equal(true);

      timePicker.value = '12:00';
      expect(inputElement.invalid).to.equal(true);
    });

    it('should validate correctly with required flag', () => {
      timePicker.name = 'foo';
      timePicker.required = true;

      expect(timePicker.validate()).to.equal(false);
      expect(timePicker.invalid).to.be.equal(true);

      timePicker.value = '13:00';
      expect(timePicker.validate()).to.equal(true);
      expect(timePicker.invalid).to.be.equal(false);
    });

    it('should validate correctly with required flag on blur', () => {
      timePicker.name = 'foo';
      timePicker.required = true;

      inputElement.dispatchEvent(new CustomEvent('blur', { composed: true }));
      expect(timePicker.invalid).to.be.equal(true);
    });

    it('should respect min value during validation', () => {
      timePicker.step = '0.5';
      timePicker.min = '01:00';
      timePicker.value = '00:59:59.500';

      expect(timePicker.validate()).to.equal(false);
      expect(timePicker.invalid).to.be.equal(true);

      timePicker.value = '01:00:00.000';
      expect(timePicker.validate()).to.equal(true);
      expect(timePicker.invalid).to.be.equal(false);
    });

    it('should respect max value during validation', () => {
      timePicker.step = '0.5';
      timePicker.max = '01:00';
      timePicker.value = '01:00:00.500';

      expect(timePicker.validate()).to.equal(false);
      expect(timePicker.invalid).to.be.equal(true);

      timePicker.value = '01:00:00.000';
      expect(timePicker.validate()).to.equal(true);
      expect(timePicker.invalid).to.be.equal(false);
    });

    it('should not mark empty input as invalid', () => {
      expect(timePicker.validate()).to.equal(true);

      inputValue('22:00');
      expect(timePicker.validate()).to.equal(true);

      inputValue('');
      expect(timePicker.validate()).to.equal(true);
    });

    it('should validate correctly with pattern regexp', () => {
      timePicker.pattern = '^1\\d:.*';

      timePicker.value = '20:01';
      expect(timePicker.validate()).to.equal(false);
      expect(timePicker.invalid).to.equal(true);

      timePicker.value = '11:00';
      expect(inputElement.value).to.equal('11:00');
      expect(timePicker.validate()).to.equal(true);
      expect(timePicker.invalid).to.equal(false);
    });

    it('should prevent invalid input', () => {
      timePicker.pattern = '^1\\d:.*';
      timePicker.preventInvalidInput = true;

      inputValue('22:00');
      expect(inputElement.value).to.be.not.ok;

      inputValue('12:34');
      expect(inputElement.value).to.equal('12:34');
    });

    it('should be possible to force invalid status', () => {
      timePicker.invalid = true;
      expect(inputElement.invalid).to.be.true;
    });

    it('should display the error-message when invalid', () => {
      timePicker.invalid = true;
      timePicker.errorMessage = 'Not cool';
      expect(inputElement.errorMessage).to.equal(timePicker.errorMessage);
    });

    it('should have disabled vaadin-text-field', () => {
      timePicker.disabled = true;
      expect(inputElement.hasAttribute('disabled')).to.be.true;
      expect(inputElement.disabled).to.equal(true);
    });

    it('should validate keyboard input (invalid)', () => {
      inputValue('foo');
      expect(timePicker.invalid).to.be.equal(false);
      blurInput();
      expect(timePicker.invalid).to.be.equal(true);
    });

    it('should validate keyboard input (valid)', () => {
      inputValue('12:00');
      blurInput();
      expect(timePicker.invalid).to.be.equal(false);
    });

    it('should validate keyboard input (disallowed value)', () => {
      inputValue('99:00');
      expect(timePicker.invalid).to.be.equal(false);
      blurInput();
      expect(timePicker.invalid).to.be.equal(true);
    });
  });

  describe('custom validator', () => {
    beforeEach(async () => {
      timePicker = await fixture(html`<vaadin-time-picker-20></vaadin-time-picker-20>`);
    });

    it('should validate correctly with custom validator', () => {
      // Try invalid value.
      timePicker.value = '20:01';
      expect(timePicker.validate()).to.equal(false);
      expect(timePicker.invalid).to.equal(true);

      // Try valid value.
      timePicker.value = '20:00';
      expect(timePicker.validate()).to.equal(true);
      expect(timePicker.invalid).to.equal(false);
    });
  });
});
