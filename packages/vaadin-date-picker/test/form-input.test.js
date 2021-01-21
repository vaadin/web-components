import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixture, html } from '@open-wc/testing-helpers';
import './not-animated-styles.js';
import { close, open } from './common.js';
import { DatePickerElement } from '../vaadin-date-picker.js';

class DatePicker2016Element extends DatePickerElement {
  checkValidity(value) {
    return new Date(value).getFullYear() === 2016;
  }
}

customElements.define('vaadin-date-picker-2016', DatePicker2016Element);

describe('form input', () => {
  let datepicker;

  function inputValue(value) {
    const input = datepicker._nativeInput;
    input.value = value;
    input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
  }

  describe('date picker', () => {
    beforeEach(async () => {
      datepicker = await fixture(html`<vaadin-date-picker></vaadin-date-picker>`);
    });

    it('should have the given name', () => {
      datepicker.name = 'foo';
      expect(datepicker._inputElement.name).to.equal('foo');
    });

    it('should have no name', () => {
      expect(datepicker._inputElement.name).to.be.undefined;
    });

    it('should be required', () => {
      datepicker.required = true;
      expect(datepicker._inputElement.required).to.be.true;
    });

    it('should not be required', () => {
      expect(datepicker._inputElement.required).to.be.false;
    });

    it('should validate correctly with required flag', async () => {
      datepicker.name = 'foo';
      datepicker.required = true;

      await aTimeout();
      expect(datepicker.validate()).to.equal(false);
      expect(datepicker.invalid).to.be.equal(true);

      datepicker.value = '2016-02-24';
      expect(datepicker.validate()).to.equal(true);
      expect(datepicker.invalid).to.be.equal(false);
    });

    it('should validate min/max dates', () => {
      datepicker.min = '2000-01-01';
      datepicker.max = '2001-01-01';

      // Set invalid value.
      datepicker.value = '2014-01-01';
      expect(datepicker.validate()).to.equal(false);
      expect(datepicker.invalid).to.be.equal(true);

      datepicker.value = '2000-02-01';
      expect(datepicker.validate()).to.equal(true);
      expect(datepicker.invalid).to.be.equal(false);
    });

    it('should be possible to force invalid status', () => {
      datepicker.invalid = true;
      expect(datepicker._inputElement.invalid).to.be.true;
    });

    it('should re-validate old input after selecting date', async () => {
      // Set invalid value.
      inputValue('foo');
      expect(datepicker.validate()).to.equal(false);
      await open(datepicker);
      datepicker.value = '2000-02-01';
      await close(datepicker);
      expect(datepicker.invalid).to.equal(false);
    });

    it('should set proper validity by the time the value-changed event is fired', (done) => {
      // Set invalid value.
      inputValue('foo');
      expect(datepicker.validate()).to.equal(false);

      const spy = sinon.spy(datepicker, 'validate');

      datepicker.addEventListener('value-changed', () => {
        expect(spy.callCount).to.equal(1);
        expect(datepicker.invalid).to.equal(false);
        done();
      });

      datepicker.open();
      inputValue('01/01/2000');
      datepicker.close();
    });

    it('should display the error-message when invalid', () => {
      datepicker.invalid = true;
      datepicker.errorMessage = 'Not cool';
      expect(datepicker._inputElement.errorMessage).to.equal(datepicker.errorMessage);
    });

    it('should have disabled vaadin-text-field', () => {
      datepicker.disabled = true;
      expect(datepicker._inputElement.hasAttribute('disabled')).to.be.true;
      expect(datepicker._inputElement.disabled).to.equal(true);
    });

    it('should validate keyboard input (invalid)', async () => {
      inputValue('foo');
      await close(datepicker);
      expect(datepicker.validate()).to.equal(false);
      expect(datepicker.invalid).to.be.equal(true);
    });

    it('should keep invalid input value during value-changed event', (done) => {
      datepicker.value = '2020-01-01';
      inputValue('foo');

      datepicker.addEventListener('value-changed', () => {
        expect(datepicker._inputValue).to.equal('foo');
        done();
      });
      datepicker.close();
    });

    it('should validate keyboard input (valid)', async () => {
      inputValue('01/01/2000');
      await close(datepicker);
      expect(datepicker.validate()).to.equal(true);
      expect(datepicker.invalid).to.be.equal(false);
    });

    it('should validate keyboard input (disallowed value)', async () => {
      datepicker.min = '2001-01-01';
      inputValue('01/01/2000');
      await close(datepicker);
      expect(datepicker.validate()).to.equal(false);
      expect(datepicker.invalid).to.be.equal(true);
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      datepicker = await fixture(html`<vaadin-date-picker required></vaadin-date-picker>`);
    });

    it('should not be invalid without user interactions', () => {
      expect(datepicker.invalid).to.be.false;
    });

    it('should be invalid after validate() if value is not set', () => {
      datepicker.validate();
      expect(datepicker.invalid).to.be.true;
    });
  });

  describe('custom validator', () => {
    beforeEach(async () => {
      datepicker = await fixture(html`<vaadin-date-picker-2016></vaadin-date-picker-2016>`);
    });

    it('should validate correctly with custom validator', () => {
      // Try invalid value.
      datepicker.value = '2014-01-01';
      expect(datepicker.validate()).to.equal(false);
      expect(datepicker.invalid).to.equal(true);

      // Try valid value.
      datepicker.value = '2016-01-01';
      expect(datepicker.validate()).to.equal(true);
      expect(datepicker.invalid).to.equal(false);
    });
  });
});
