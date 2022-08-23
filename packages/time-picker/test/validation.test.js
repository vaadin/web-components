import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync, focusout, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { TimePicker } from '../src/vaadin-time-picker.js';
import { setInputValue } from './helpers.js';

class TimePicker20Element extends TimePicker {
  checkValidity() {
    return this.value === '20:00';
  }
}

customElements.define('vaadin-time-picker-20', TimePicker20Element);

describe('validation', () => {
  let timePicker;

  describe('initial', () => {
    let validateSpy;

    beforeEach(() => {
      timePicker = document.createElement('vaadin-time-picker');
      validateSpy = sinon.spy(timePicker, 'validate');
    });

    afterEach(() => {
      timePicker.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(timePicker);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      timePicker.value = '12:00';
      document.body.appendChild(timePicker);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      timePicker.value = '12:00';
      timePicker.invalid = true;
      document.body.appendChild(timePicker);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('basic', () => {
    let validateSpy;

    beforeEach(() => {
      timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
      validateSpy = sinon.spy(timePicker, 'validate');
    });

    it('should pass validation by default', () => {
      expect(timePicker.checkValidity()).to.be.true;
      expect(timePicker.validate()).to.be.true;
    });

    it('should not validate on value input', () => {
      setInputValue(timePicker, '12:00');
      expect(validateSpy.calledOnce).to.be.false;
    });

    it('should validate on value commit', () => {
      setInputValue(timePicker, '12:00');
      enter(timePicker.inputElement);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on input focusout', () => {
      focusout(timePicker.inputElement);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should be possible to force invalid status', () => {
      timePicker.invalid = true;
      expect(timePicker.inputElement.hasAttribute('invalid')).to.be.true;
    });

    it('should not validate on min change without value', () => {
      timePicker.min = '12:00';
      expect(validateSpy.called).to.be.false;
    });

    it('should validate on min change with value', () => {
      timePicker.value = '12:00';
      validateSpy.resetHistory();
      timePicker.min = '12:00';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should not validate on max change without value', () => {
      timePicker.max = '12:00';
      expect(validateSpy.called).to.be.false;
    });

    it('should validate on max change with value', () => {
      timePicker.value = '12:00';
      validateSpy.resetHistory();
      timePicker.max = '12:00';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      timePicker.addEventListener('validated', validatedSpy);
      timePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      timePicker.addEventListener('validated', validatedSpy);
      timePicker.required = true;
      timePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('input value', () => {
    beforeEach(() => {
      timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    });

    it('should be valid when committing a valid time', () => {
      setInputValue(timePicker, '12:00');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.false;
    });

    it('should be invalid when trying to commit an invalid time', () => {
      setInputValue(timePicker, 'foo');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.true;
    });

    it('should be invalid when trying to change value to an invalid time', () => {
      timePicker.value = '12:00';
      setInputValue(timePicker, 'foo');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.true;
    });
  });

  describe('required', () => {
    beforeEach(() => {
      timePicker = fixtureSync(`<vaadin-time-picker required></vaadin-time-picker>`);
    });

    it('should fail validation without value', () => {
      expect(timePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a valid value', () => {
      timePicker.value = '12:00';
      expect(timePicker.checkValidity()).to.be.true;
    });

    it('should be valid when committing a non-empty value', () => {
      setInputValue(timePicker, '12:00');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.false;
    });

    it('should be invalid when committing an empty value', () => {
      setInputValue(timePicker, '12:00');
      enter(timePicker.inputElement);
      setInputValue(timePicker, '');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.true;
    });
  });

  describe('min', () => {
    beforeEach(() => {
      timePicker = fixtureSync(`<vaadin-time-picker min="10:00"></vaadin-time-picker>`);
    });

    it('should pass validation without value', () => {
      expect(timePicker.checkValidity()).to.be.true;
    });

    it('should fail validation with a value < min', () => {
      timePicker.value = '08:00';
      expect(timePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a value > min', () => {
      timePicker.value = '12:00';
      expect(timePicker.checkValidity()).to.be.true;
    });

    it('should pass validation with a value = min', () => {
      timePicker.value = '10:00';
      expect(timePicker.checkValidity()).to.be.true;
    });

    it('should be invalid when committing a value < min', () => {
      setInputValue(timePicker, '08:00');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.true;
    });

    it('should be valid when committing a value > min', () => {
      setInputValue(timePicker, '12:00');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.false;
    });

    it('should be valid when committing a value = min', () => {
      setInputValue(timePicker, '10:00');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.false;
    });
  });

  describe('max', () => {
    beforeEach(() => {
      timePicker = fixtureSync(`<vaadin-time-picker max="10:00"></vaadin-time-picker>`);
    });

    it('should pass validation without value', () => {
      expect(timePicker.checkValidity()).to.be.true;
    });

    it('should fail validation with a value > max', () => {
      timePicker.value = '12:00';
      expect(timePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a value < max', () => {
      timePicker.value = '08:00';
      expect(timePicker.checkValidity()).to.be.true;
    });

    it('should pass validation with a value = max', () => {
      timePicker.value = '10:00';
      expect(timePicker.checkValidity()).to.be.true;
    });

    it('should be invalid when committing a value > max', () => {
      setInputValue(timePicker, '12:00');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.true;
    });

    it('should be valid when committing a value < max', () => {
      setInputValue(timePicker, '08:00');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.false;
    });

    it('should be valid when committing a value = max', () => {
      setInputValue(timePicker, '10:00');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.false;
    });
  });

  describe('pattern', () => {
    beforeEach(() => {
      timePicker = fixtureSync(`<vaadin-time-picker pattern="^1\\d:.*"></vaadin-time-picker>`);
    });

    it('should pass validation without value', () => {
      expect(timePicker.checkValidity()).to.be.true;
    });

    it('should fail validation with a value not matching the pattern', () => {
      timePicker.value = '20:00';
      expect(timePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a value matching the pattern', () => {
      timePicker.value = '10:00';
      expect(timePicker.checkValidity()).to.be.true;
    });

    it('should be invalid when committing a value not matching the pattern', () => {
      setInputValue(timePicker, '20:00');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.true;
    });

    it('should be valid when committing a value matching the pattern', () => {
      setInputValue(timePicker, '10:00');
      enter(timePicker.inputElement);
      expect(timePicker.invalid).to.be.false;
    });

    it('should prevent invalid input', () => {
      timePicker.preventInvalidInput = true;

      setInputValue(timePicker, '22:00');
      expect(timePicker.inputElement.value).to.be.not.ok;

      setInputValue(timePicker, '12:34');
      expect(timePicker.inputElement.value).to.equal('12:34');
    });
  });

  describe('custom validator', () => {
    beforeEach(() => {
      timePicker = fixtureSync(`<vaadin-time-picker-20></vaadin-time-picker-20>`);
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

  describe('incorrect value', () => {
    it('should not throw error when setting incorrect value using attribute', () => {
      expect(() => fixtureSync(`<vaadin-time-picker value="1500"></vaadin-time-picker>`)).to.not.throw(Error);
    });
  });
});
