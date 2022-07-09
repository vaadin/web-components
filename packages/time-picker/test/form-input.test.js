import { expect } from '@esm-bundle/chai';
import { fixtureSync, focusout, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { TimePicker } from '../src/vaadin-time-picker.js';

class TimePicker20Element extends TimePicker {
  checkValidity() {
    return this.value === '20:00';
  }
}

customElements.define('vaadin-time-picker-20', TimePicker20Element);

describe('form input', () => {
  let timePicker, comboBox, inputElement;

  function inputValue(value) {
    inputElement.value = value;
    inputElement.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
  }

  describe('initial validation', () => {
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

  describe('default validator', () => {
    beforeEach(() => {
      timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
      comboBox = timePicker.$.comboBox;
      inputElement = timePicker.inputElement;
    });

    it('should pass the name to input element', () => {
      timePicker.name = 'foo';
      expect(inputElement.name).to.equal('foo');
    });

    it('should set name to empty string by default', () => {
      expect(inputElement.name).to.equal('');
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
      comboBox.dispatchEvent(new CustomEvent('change', { bubbles: true }));

      expect(inputElement.hasAttribute('invalid')).to.be.true;

      timePicker.value = '12:00';
      expect(inputElement.hasAttribute('invalid')).to.be.true;
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

    it('should validate correctly with required flag on focusout', () => {
      timePicker.name = 'foo';
      timePicker.required = true;

      focusout(inputElement);
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
      expect(inputElement.hasAttribute('invalid')).to.be.true;
    });

    it('should display the error-message when invalid', () => {
      timePicker.invalid = true;
      timePicker.errorMessage = 'Not cool';
      expect(timePicker.hasAttribute('has-error-message')).to.be.true;
    });

    it('should validate keyboard input (invalid)', () => {
      inputValue('foo');
      expect(timePicker.invalid).to.be.equal(false);
      focusout(comboBox);
      expect(timePicker.invalid).to.be.equal(true);
    });

    it('should validate keyboard input (valid)', () => {
      inputValue('12:00');
      focusout(comboBox);
      expect(timePicker.invalid).to.be.equal(false);
    });

    it('should validate keyboard input (disallowed value)', () => {
      inputValue('99:00');
      expect(timePicker.invalid).to.be.equal(false);
      focusout(comboBox);
      expect(timePicker.invalid).to.be.equal(true);
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
});
