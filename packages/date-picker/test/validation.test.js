import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import { DatePicker } from '../vaadin-date-picker.js';
import { close, open, setInputValue, waitForOverlayRender, waitForScrollToFinish } from './helpers.js';

class DatePicker2016 extends DatePicker {
  checkValidity() {
    return new Date(this.value).getFullYear() === 2016;
  }
}

customElements.define('vaadin-date-picker-2016', DatePicker2016);

function waitForValueChange(datePicker, callback) {
  let stub;

  return new Promise((resolve) => {
    stub = sinon.stub().callsFake((e) => {
      resolve(stub);
    });

    datePicker.addEventListener('value-changed', stub);
    callback();
  });
}

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
    let validateSpy, changeSpy, input;

    beforeEach(async () => {
      datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
      await nextRender();
      input = datePicker.inputElement;
      validateSpy = sinon.spy(datePicker, 'validate');
      changeSpy = sinon.spy();
      datePicker.addEventListener('change', changeSpy);
    });

    it('should pass validation by default', () => {
      expect(datePicker.checkValidity()).to.be.true;
      expect(datePicker.validate()).to.be.true;
    });

    it('should validate on blur', () => {
      input.focus();
      input.blur();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate before change event on blur', async () => {
      datePicker.value = '2023-01-01';
      validateSpy.resetHistory();
      input.focus();
      input.select();
      await sendKeys({ press: 'Backspace' });
      input.blur();
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.called).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should validate on outside click', async () => {
      input.focus();
      input.click();
      await waitForOverlayRender();
      outsideClick();
      await nextUpdate(datePicker);
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate before change event on outside click', async () => {
      input.focus();
      input.click();
      await waitForOverlayRender();
      await sendKeys({ type: '1/1/2023' });
      await waitForScrollToFinish(datePicker._overlayContent);
      outsideClick();
      await nextUpdate(datePicker);
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should not validate on input click while opened', async () => {
      await open(datePicker);
      validateSpy.resetHistory();
      input.click();
      expect(validateSpy.called).to.be.false;
    });

    it('should validate before change event on clear button click', async () => {
      datePicker.clearButtonVisible = true;
      datePicker.value = '2022-01-01';
      validateSpy.resetHistory();
      datePicker.$.clearButton.click();
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
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
      await close(datePicker);
      expect(datePicker.invalid).to.be.false;
    });

    it('should set proper validity by the time the value-changed event is fired', async () => {
      // Set invalid value.
      setInputValue(datePicker, 'foo');
      await waitForOverlayRender();

      expect(datePicker.validate()).to.be.false;

      validateSpy.resetHistory();

      setInputValue(datePicker, '01/01/2000');
      const valueChangeSpy = await waitForValueChange(datePicker, () => datePicker.close());

      expect(valueChangeSpy.calledAfter(validateSpy)).to.be.true;
      expect(validateSpy.callCount).to.equal(1);
      expect(datePicker.invalid).to.be.false;
    });

    it('should keep invalid input value when closing overlay', async () => {
      datePicker.value = '2020-01-01';
      setInputValue(datePicker, 'foo');
      await waitForOverlayRender();
      await waitForValueChange(datePicker, () => datePicker.close());
      expect(input.value).to.equal('foo');
    });

    it('should change invalid state only once', async () => {
      datePicker.min = '2016-01-01';
      datePicker.max = '2016-12-31';

      const invalidChangedSpy = sinon.spy();
      datePicker.addEventListener('invalid-changed', invalidChangedSpy);

      await open(datePicker);

      await waitForValueChange(datePicker, () => {
        datePicker._overlayContent._selectDate(new Date('2017-01-01')); // Invalid
      });

      expect(invalidChangedSpy.calledOnce).to.be.true;
    });

    it('should reflect correct invalid value on value-changed eventListener', async () => {
      datePicker.min = '2016-01-01';
      datePicker.max = '2016-12-31';
      datePicker.value = '2016-01-01'; // Valid

      await open(datePicker);

      await waitForValueChange(datePicker, () => {
        datePicker._overlayContent._selectDate(new Date('2017-01-01')); // Invalid
      });

      expect(datePicker.invalid).to.be.true;
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
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.false;
    });

    it('should be invalid when trying to commit an invalid date', async () => {
      setInputValue(datePicker, 'foo');
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.true;
    });

    it('should set an empty value when trying to commit an invalid date', async () => {
      datePicker.value = '2020-01-01';
      setInputValue(datePicker, 'foo');
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.value).to.equal('');
      expect(input.value).to.equal('foo');
    });

    describe('autoOpenDisabled', () => {
      beforeEach(() => {
        datePicker.autoOpenDisabled = true;
      });

      it('should set an empty value when trying to commit an invalid date with enter', () => {
        datePicker.autoOpenDisabled = true;
        datePicker.value = '2020-01-01';
        setInputValue(datePicker, 'foo');
        enter(input);
        expect(datePicker.value).to.equal('');
        expect(input.value).to.equal('foo');
        expect(datePicker.invalid).to.be.true;
      });

      it('should set an empty value when trying to commit an invalid date with blur', () => {
        datePicker.autoOpenDisabled = true;
        datePicker.value = '2020-01-01';
        setInputValue(datePicker, 'foo');
        input.blur();
        expect(datePicker.value).to.equal('');
        expect(input.value).to.equal('foo');
        expect(datePicker.invalid).to.be.true;
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
    let input;

    beforeEach(async () => {
      datePicker = fixtureSync(`<vaadin-date-picker required></vaadin-date-picker>`);
      await nextRender();
      input = datePicker.inputElement;
    });

    it('should fail validation without value', () => {
      expect(datePicker.checkValidity()).to.be.false;
    });

    it('should pass validation with a valid value', () => {
      datePicker.value = '2000-01-01';
      expect(datePicker.checkValidity()).to.be.true;
    });

    it('should be valid when committing a non-empty value', async () => {
      setInputValue(datePicker, '1/1/2000');
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.false;
    });

    it('should be invalid when committing an empty value', async () => {
      setInputValue(datePicker, '1/1/2000');
      await waitForOverlayRender();
      enter(input);

      setInputValue(datePicker, '');
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);

      expect(datePicker.invalid).to.be.true;
    });
  });

  describe('min', () => {
    let input;

    beforeEach(async () => {
      datePicker = fixtureSync(`<vaadin-date-picker min="2010-01-01"></vaadin-date-picker>`);
      await nextRender();
      input = datePicker.inputElement;
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

    it('should be invalid when committing a value < min', async () => {
      setInputValue(datePicker, '1/1/2000');
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.true;
    });

    it('should be valid when committing a value > min', async () => {
      setInputValue(datePicker, '1/1/2022');
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.false;
    });

    it('should be valid when committing a value = min', async () => {
      setInputValue(datePicker, '1/1/2022');
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.false;
    });
  });

  describe('max', () => {
    let input;

    beforeEach(async () => {
      datePicker = fixtureSync(`<vaadin-date-picker max="2010-01-01"></vaadin-date-picker>`);
      await nextRender();
      input = datePicker.inputElement;
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

    it('should be invalid when committing a value > max', async () => {
      setInputValue(datePicker, '1/1/2022');
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.true;
    });

    it('should be valid when committing a value < max', async () => {
      setInputValue(datePicker, '1/1/2000');
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.false;
    });

    it('should be valid when committing a value = max', async () => {
      setInputValue(datePicker, '1/1/2010');
      await waitForOverlayRender();
      enter(input);
      await nextUpdate(datePicker);
      expect(datePicker.invalid).to.be.false;
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
