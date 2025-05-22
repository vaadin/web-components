import { expect } from '@vaadin/chai-plugins';
import { enter, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { open, setInputValue, untilOverlayRendered } from './helpers.js';

class DatePicker2016 extends customElements.get('vaadin-date-picker') {
  checkValidity() {
    return new Date(this.value).getFullYear() === 2016;
  }
}

customElements.define('vaadin-date-picker-2016', DatePicker2016);

describe('validation', () => {
  let datePicker;

  describe('initial', () => {
    let validateSpy;

    beforeEach(() => {
      datePicker = document.createElement('vaadin-date-picker');
      validateSpy = sinon.spy(datePicker, 'validate');
    });

    afterEach(() => {
      datePicker.remove();
    });

    it('should not validate without value', async () => {
      document.body.appendChild(datePicker);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    describe('with value', () => {
      beforeEach(() => {
        datePicker.value = '2020-01-01';
      });

      it('should not validate without constraints', async () => {
        document.body.appendChild(datePicker);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate without constraints when the field has invalid', async () => {
        datePicker.invalid = true;
        document.body.appendChild(datePicker);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should validate when the field has min', async () => {
        datePicker.min = '2020-01-01';
        document.body.appendChild(datePicker);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate when the field has max', async () => {
        datePicker.max = '2020-01-01';
        document.body.appendChild(datePicker);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });
    });
  });

  describe('basic', () => {
    let valueChangedSpy, validateSpy, changeSpy, input;

    beforeEach(async () => {
      datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
      await nextRender();
      input = datePicker.inputElement;
      validateSpy = sinon.spy(datePicker, 'validate');
      changeSpy = sinon.spy();
      datePicker.addEventListener('change', changeSpy);
      valueChangedSpy = sinon.spy();
      datePicker.addEventListener('value-changed', valueChangedSpy);
    });

    it('should pass validation by default', () => {
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should not validate on input click while opened', async () => {
      await open(datePicker);
      validateSpy.resetHistory();
      input.click();
      expect(validateSpy.called).to.be.false;
    });

    it('should validate on value change', () => {
      datePicker.value = '2020-01-01';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should not validate on min change when no value is provided', () => {
      datePicker.min = '2020-01-01';
      expect(validateSpy.called).to.be.false;
    });

    it('should validate on min change when a value is provided', () => {
      datePicker.value = '2020-01-01';
      validateSpy.resetHistory();
      datePicker.min = '2020-01-01';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should not validate on max change when no value is provided', () => {
      datePicker.max = '2020-01-01';
      expect(validateSpy.called).to.be.false;
    });

    it('should validate on max change when a value is provided', () => {
      datePicker.value = '2020-01-01';
      validateSpy.resetHistory();
      datePicker.max = '2020-01-01';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should be possible to force invalid status', async () => {
      datePicker.invalid = true;
      await nextUpdate(datePicker);
      expect(input.hasAttribute('invalid')).to.be.true;
    });

    it('should re-validate old input after selecting date', async () => {
      // Set invalid value.
      setInputValue(datePicker, 'foo');
      expect(datePicker.validate()).to.be.false;
      await open(datePicker);
      datePicker.value = '2000-02-01';
      datePicker.close();
      expect(datePicker.invalid).to.be.false;
    });

    it('should change invalid state only once', async () => {
      datePicker.min = '2016-01-01';
      datePicker.max = '2016-12-31';

      await open(datePicker);

      const selectResult = datePicker._overlayContent._selectDate(new Date('2017-01-01')); // Invalid
      expect(selectResult).to.be.equal(false);
    });

    it('should reflect correct invalid value on value-changed eventListener', async () => {
      datePicker.min = '2016-01-01';
      datePicker.max = '2016-12-31';
      datePicker.value = '2016-01-01'; // Valid

      await open(datePicker);

      const selectResult = datePicker._overlayContent._selectDate(new Date('2017-01-01')); // Invalid
      expect(selectResult).to.be.equal(false);
    });

    it('should reflect correct invalid value on value-changed eventListener when using isDateDisabled', async () => {
      datePicker.isDateDisabled = (date) => {
        if (!date) {
          return false;
        }
        const valid = date.year === 2017 && date.month === 0 && date.day === 1;
        return valid;
      };
      datePicker.value = '2016-01-01'; // Valid

      await open(datePicker);
      const selectResult = datePicker._overlayContent._selectDate(new Date('2017-01-01T12:00:00')); // Invalid
      expect(selectResult).to.be.equal(false);
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      datePicker.addEventListener('validated', validatedSpy);
      datePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', async () => {
      const validatedSpy = sinon.spy();
      datePicker.addEventListener('validated', validatedSpy);
      datePicker.required = true;
      await nextUpdate(datePicker);
      datePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });

    describe('document losing focus', () => {
      beforeEach(() => {
        sinon.stub(document, 'hasFocus').returns(false);
      });

      afterEach(() => {
        document.hasFocus.restore();
      });

      it('should not validate on blur when document does not have focus', () => {
        input.focus();
        input.blur();
        expect(validateSpy.called).to.be.false;
      });
    });
  });

  describe('input value', () => {
    let input;

    beforeEach(async () => {
      datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
      await nextRender();
      input = datePicker.inputElement;
      input.focus();
    });

    it('should be valid when committing a valid date', async () => {
      setInputValue(datePicker, '1/1/2022');
      await untilOverlayRendered(datePicker);
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.false;
    });

    it('should be invalid when trying to commit an invalid date', async () => {
      setInputValue(datePicker, 'foo');
      await untilOverlayRendered(datePicker);
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.true;
    });

    describe('autoOpenDisabled', () => {
      beforeEach(() => {
        datePicker.autoOpenDisabled = true;
      });

      it('should be valid on blur after entering a valid date', () => {
        datePicker.autoOpenDisabled = true;
        setInputValue(datePicker, '1/1/2022');
        input.blur();
        expect(datePicker.invalid).to.be.false;
      });

      it('should be invalid on blur after entering an invalid date', () => {
        datePicker.autoOpenDisabled = true;
        setInputValue(datePicker, 'foo');
        input.blur();
        expect(datePicker.invalid).to.be.true;
      });
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      datePicker = fixtureSync(`<vaadin-date-picker required></vaadin-date-picker>`);
      await nextRender();
    });

    it('should fail validation without value', () => {
      expect(datePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a valid value', () => {
      datePicker.value = '2000-01-01';
      expect(datePicker.checkValidity()).to.be.true;
    });
  });

  describe('min', () => {
    beforeEach(async () => {
      datePicker = fixtureSync(`<vaadin-date-picker min="2010-01-01"></vaadin-date-picker>`);
      await nextRender();
    });

    it('should pass validation without value', () => {
      expect(datePicker.checkValidity()).to.be.true;
    });

    it('should fail validation with a value < min', () => {
      datePicker.value = '2000-01-01';
      expect(datePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a value > min', () => {
      datePicker.value = '2020-01-01';
      expect(datePicker.checkValidity()).to.be.true;
    });

    it('should pass validation with a value = min', () => {
      datePicker.value = '2010-01-01';
      expect(datePicker.checkValidity()).to.be.true;
    });
  });

  describe('max', () => {
    beforeEach(async () => {
      datePicker = fixtureSync(`<vaadin-date-picker max="2010-01-01"></vaadin-date-picker>`);
      await nextRender();
    });

    it('should pass validation without value', () => {
      expect(datePicker.checkValidity()).to.be.true;
    });

    it('should fail validation with a value > max', () => {
      datePicker.value = '2020-01-01';
      expect(datePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a value < max', () => {
      datePicker.value = '2000-01-01';
      expect(datePicker.checkValidity()).to.be.true;
    });

    it('should pass validation with a value = max', () => {
      datePicker.value = '2010-01-01';
      expect(datePicker.checkValidity()).to.be.true;
    });
  });

  describe('custom validator', () => {
    beforeEach(() => {
      datePicker = fixtureSync(`<vaadin-date-picker-2016></vaadin-date-picker-2016>`);
    });

    it('should validate correctly with custom validator', () => {
      // Try invalid value.
      datePicker.value = '2014-06-01';
      expect(datePicker.validate()).to.be.false;
      expect(datePicker.invalid).to.be.true;

      // Try valid value.
      datePicker.value = '2016-06-01';
      expect(datePicker.validate()).to.be.true;
      expect(datePicker.invalid).to.be.false;
    });
  });
});
