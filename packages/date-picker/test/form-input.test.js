import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import { DatePicker } from '../vaadin-date-picker.js';
import { close, getOverlayContent, open, setInputValue } from './common.js';

class DatePicker2016 extends DatePicker {
  checkValidity() {
    return new Date(this.value).getFullYear() === 2016;
  }
}

customElements.define('vaadin-date-picker-2016', DatePicker2016);

describe('form input', () => {
  let datePicker;

  describe('basic', () => {
    let validateSpy;

    beforeEach(() => {
      datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
      validateSpy = sinon.spy(datePicker, 'validate');
    });

    it('should pass validation by default', () => {
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should validate on blur', () => {
      datePicker.inputElement.focus();
      datePicker.inputElement.blur();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on close', async () => {
      await open(datePicker);
      validateSpy.resetHistory();
      await close(datePicker);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on value change', () => {
      datePicker.value = '2020-01-01';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on min change when a value is provided', () => {
      datePicker.value = '2020-01-01';
      validateSpy.resetHistory();
      datePicker.min = '2020-01-01';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on max change when a value is provided', () => {
      datePicker.value = '2020-01-01';
      validateSpy.resetHistory();
      datePicker.max = '2020-01-01';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should be possible to force invalid status', () => {
      datePicker.invalid = true;
      expect(datePicker.inputElement.hasAttribute('invalid')).to.be.true;
    });

    it('should re-validate old input after selecting date', async () => {
      // Set invalid value.
      setInputValue(datePicker, 'foo');
      expect(datePicker.validate()).to.be.false;
      await open(datePicker);
      datePicker.value = '2000-02-01';
      await close(datePicker);
      expect(datePicker.invalid).to.be.false;
    });

    it('should set proper validity by the time the value-changed event is fired', (done) => {
      // Set invalid value.
      setInputValue(datePicker, 'foo');
      expect(datePicker.validate()).to.be.false;

      validateSpy.resetHistory();

      datePicker.addEventListener('value-changed', () => {
        expect(validateSpy.callCount).to.equal(1);
        expect(datePicker.invalid).to.be.false;
        done();
      });

      datePicker.open();
      setInputValue(datePicker, '01/01/2000');
      datePicker.close();
    });

    it('should keep invalid input value during value-changed event', (done) => {
      datePicker.value = '2020-01-01';
      setInputValue(datePicker, 'foo');

      datePicker.addEventListener('value-changed', () => {
        expect(datePicker._inputValue).to.equal('foo');
        done();
      });
      datePicker.close();
    });

    it('should reflect correct invalid value on value-changed eventListener', (done) => {
      datePicker.min = '2016-01-01';
      datePicker.max = '2016-12-31';
      datePicker.value = '2016-01-01'; // Valid

      datePicker.addEventListener('value-changed', () => {
        expect(datePicker.invalid).to.be.equal(true);
        done();
      });

      datePicker.open();
      getOverlayContent(datePicker)._selectDate(new Date('2017-01-01')); // Invalid
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      datePicker.addEventListener('validated', validatedSpy);
      datePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      datePicker.addEventListener('validated', validatedSpy);
      datePicker.required = true;
      datePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('input value', () => {
    beforeEach(() => {
      datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
    });

    it('should pass validation when the entered value is a valid date', async () => {
      setInputValue(datePicker, '1/1/2022');
      await close(datePicker);
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should fail validation when the entered value is an invalid date', async () => {
      setInputValue(datePicker, 'foo');
      await close(datePicker);
      expect(datePicker.checkValidity()).to.be.false;
      expect(datePicker.validate()).to.be.false;
    });

    it('should set an empty value when trying to commit an invalid value', async () => {
      datePicker.value = '2020-01-01';
      setInputValue(datePicker, 'foo');
      await close(datePicker);
      expect(datePicker.value).to.equal('');
      expect(datePicker.inputElement.value).to.equal('foo');
    });
  });

  describe('required', () => {
    beforeEach(() => {
      datePicker = fixtureSync(`<vaadin-date-picker required></vaadin-date-picker>`);
    });

    it('should fail validation without value', () => {
      expect(datePicker.checkValidity()).to.be.false;
      expect(datePicker.validate()).to.be.false;
    });

    it('should pass validation with a valid value', () => {
      datePicker.value = '2000-01-01';
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });
  });

  describe('min', () => {
    beforeEach(() => {
      datePicker = fixtureSync(`<vaadin-date-picker min="2010-01-01"></vaadin-date-picker>`);
    });

    it('should pass validation without value', () => {
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should fail validation with a value < min', () => {
      datePicker.value = '2000-01-01';
      expect(datePicker.checkValidity()).to.be.false;
      expect(datePicker.validate()).to.be.false;
    });

    it('should pass validation with a value > min', () => {
      datePicker.value = '2020-01-01';
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should pass validation with a value = min', () => {
      datePicker.value = '2010-01-01';
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should fail validation when the entered value < min', async () => {
      setInputValue(datePicker, '1/1/2000');
      await close(datePicker);
      expect(datePicker.checkValidity()).to.be.false;
      expect(datePicker.validate()).to.be.false;
    });

    it('should pass validation when the entered value > min', async () => {
      setInputValue(datePicker, '1/1/2022');
      await close(datePicker);
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should pass validation when the entered value = min', async () => {
      setInputValue(datePicker, '1/1/2022');
      await close(datePicker);
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });
  });

  describe('max', () => {
    beforeEach(() => {
      datePicker = fixtureSync(`<vaadin-date-picker max="2010-01-01"></vaadin-date-picker>`);
    });

    it('should pass validation without value', () => {
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should fail validation with a value > max', () => {
      datePicker.value = '2020-01-01';
      expect(datePicker.checkValidity()).to.be.false;
      expect(datePicker.validate()).to.be.false;
    });

    it('should pass validation with a value < max', () => {
      datePicker.value = '2000-01-01';
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should pass validation with a value = max', () => {
      datePicker.value = '2010-01-01';
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should fail validation when the entered value > max', async () => {
      setInputValue(datePicker, '1/1/2022');
      await close(datePicker);
      expect(datePicker.checkValidity()).to.be.false;
      expect(datePicker.validate()).to.be.false;
    });

    it('should pass validation when the entered value < max', async () => {
      setInputValue(datePicker, '1/1/2000');
      await close(datePicker);
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should pass validation when the entered value = max', async () => {
      setInputValue(datePicker, '1/1/2010');
      await close(datePicker);
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });
  });

  describe('custom validator', () => {
    beforeEach(() => {
      datePicker = fixtureSync(`<vaadin-date-picker-2016></vaadin-date-picker-2016>`);
    });

    it('should validate correctly with custom validator', () => {
      // Try invalid value.
      datePicker.value = '2014-01-01';
      expect(datePicker.validate()).to.be.false;
      expect(datePicker.invalid).to.be.true;

      // Try valid value.
      datePicker.value = '2016-01-01';
      expect(datePicker.validate()).to.be.true;
      expect(datePicker.invalid).to.be.false;
    });
  });
});
