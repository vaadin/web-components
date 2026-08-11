import { expect } from '@vaadin/chai-plugins';
import { enter, fixtureSync, nextFrame, nextRender, touchend } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-time-picker.js';
import { setInputValue, strictAmPmI18n } from './helpers.js';

class TimePicker20Element extends customElements.get('vaadin-time-picker') {
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

    it('should not validate without value', async () => {
      document.body.appendChild(timePicker);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    describe('with value', () => {
      beforeEach(() => {
        timePicker.value = '12:00';
      });

      it('should not validate without constraints', async () => {
        document.body.appendChild(timePicker);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate without constraints when the field has invalid', async () => {
        timePicker.invalid = true;
        document.body.appendChild(timePicker);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });

      it('should validate when the field has min', async () => {
        timePicker.min = '12:00';
        document.body.appendChild(timePicker);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });

      it('should validate when the field has max', async () => {
        timePicker.max = '12:00';
        document.body.appendChild(timePicker);
        await nextRender();
        expect(validateSpy.calledOnce).to.be.true;
      });
    });
  });

  describe('basic', () => {
    let validateSpy, changeSpy, valueChangedSpy;

    beforeEach(async () => {
      timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
      await nextRender();
      validateSpy = sinon.spy(timePicker, 'validate');
      changeSpy = sinon.spy();
      timePicker.addEventListener('change', changeSpy);
      valueChangedSpy = sinon.spy();
      timePicker.addEventListener('value-changed', valueChangedSpy);
    });

    it('should pass validation by default', () => {
      expect(timePicker.checkValidity()).to.be.true;
      expect(timePicker.validate()).to.be.true;
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

    it('should fire a validated event on validation failure', async () => {
      const validatedSpy = sinon.spy();
      timePicker.addEventListener('validated', validatedSpy);
      timePicker.required = true;
      await nextFrame();
      timePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });

    describe('opened', () => {
      it('should not validate on overlay touch action causing internal blur', () => {
        timePicker.inputElement.focus();
        timePicker.open();

        touchend(timePicker.$.overlay);

        expect(validateSpy).to.be.not.called;
        expect(timePicker.invalid).to.be.false;
      });
    });

    describe('document losing focus', () => {
      beforeEach(() => {
        sinon.stub(document, 'hasFocus').returns(false);
      });

      afterEach(() => {
        document.hasFocus.restore();
      });

      it('should not validate on blur when document does not have focus', () => {
        timePicker.inputElement.focus();
        timePicker.inputElement.blur();
        expect(validateSpy).to.be.not.called;
        expect(timePicker.invalid).to.be.false;
      });
    });
  });

  describe('input value', () => {
    beforeEach(async () => {
      timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
      await nextRender();
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
    beforeEach(async () => {
      timePicker = fixtureSync(`<vaadin-time-picker required></vaadin-time-picker>`);
      await nextRender();
    });

    it('should fail validation without value', () => {
      expect(timePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a valid value', () => {
      timePicker.value = '12:00';
      expect(timePicker.checkValidity()).to.be.true;
    });
  });

  describe('min', () => {
    beforeEach(async () => {
      timePicker = fixtureSync(`<vaadin-time-picker min="10:00"></vaadin-time-picker>`);
      await nextRender();
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
  });

  describe('max', () => {
    beforeEach(async () => {
      timePicker = fixtureSync(`<vaadin-time-picker max="10:00"></vaadin-time-picker>`);
      await nextRender();
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
  });

  describe('midnight max', () => {
    beforeEach(async () => {
      timePicker = fixtureSync(`<vaadin-time-picker max="00:00"></vaadin-time-picker>`);
      await nextRender();
    });

    it('should fail validation with a value > max', () => {
      timePicker.value = '05:00';
      expect(timePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a value = max', () => {
      timePicker.value = '00:00';
      expect(timePicker.checkValidity()).to.be.true;
    });
  });

  describe('min and max with custom i18n', () => {
    beforeEach(async () => {
      timePicker = fixtureSync(`<vaadin-time-picker min="10:00" max="14:00"></vaadin-time-picker>`);
      await nextRender();
      timePicker.i18n = strictAmPmI18n;
    });

    it('should fail validation with a value < min', () => {
      timePicker.value = '08:00';
      expect(timePicker.checkValidity()).to.be.false;
    });

    it('should fail validation with a value > max', () => {
      timePicker.value = '16:00';
      expect(timePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a value between min and max', () => {
      timePicker.value = '12:00';
      expect(timePicker.checkValidity()).to.be.true;
    });

    it('should not pass value, min or max to the custom parser', () => {
      const parseTime = sinon.spy(strictAmPmI18n.parseTime);
      timePicker.i18n = { ...strictAmPmI18n, parseTime };
      timePicker.value = '12:00';
      timePicker.checkValidity();
      expect(parseTime).to.not.be.calledWith('12:00');
      expect(parseTime).to.not.be.calledWith('10:00');
      expect(parseTime).to.not.be.calledWith('14:00');
    });
  });

  describe('pattern', () => {
    beforeEach(async () => {
      timePicker = fixtureSync(`<vaadin-time-picker pattern="^1\\d:.*"></vaadin-time-picker>`);
      await nextRender();
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
  });

  describe('custom validator', () => {
    beforeEach(async () => {
      timePicker = fixtureSync(`<vaadin-time-picker-20></vaadin-time-picker-20>`);
      await nextRender();
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
