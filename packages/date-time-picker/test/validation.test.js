import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextFrame, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-time-picker.js';
import { untilOverlayRendered } from '@vaadin/date-picker/test/helpers.js';

class DateTimePicker2020Element extends customElements.get('vaadin-date-time-picker') {
  checkValidity() {
    return this.value === '2020-02-02T20:20';
  }
}

customElements.define('vaadin-date-time-picker-2020', DateTimePicker2020Element);

const fixtures = {
  default: '<vaadin-date-time-picker></vaadin-date-time-picker>',
  slotted: `
    <vaadin-date-time-picker>
      <vaadin-date-picker slot="date-picker"></vaadin-date-picker>
      <vaadin-time-picker slot="time-picker"></vaadin-time-picker>
    </vaadin-date-time-picker>
  `,
};

['default', 'slotted'].forEach((set) => {
  describe(`Validation (${set})`, () => {
    let dateTimePicker, validateSpy, changeSpy, datePicker, timePicker;

    beforeEach(async () => {
      dateTimePicker = fixtureSync(fixtures[set]);
      await nextRender();
      validateSpy = sinon.spy(dateTimePicker, 'validate');
      changeSpy = sinon.spy();
      dateTimePicker.addEventListener('change', changeSpy);
      datePicker = dateTimePicker.querySelector('[slot=date-picker]');
      timePicker = dateTimePicker.querySelector('[slot=time-picker]');
    });

    it('should not be required', () => {
      expect(dateTimePicker.required).not.to.be.ok;
    });

    it('should call checkValidity when validate is called', () => {
      const validitySpy = sinon.spy(dateTimePicker, 'checkValidity');
      dateTimePicker.validate();
      expect(validitySpy.called).to.be.true;
      expect(dateTimePicker.invalid).to.be.false;
    });

    it('should validate correctly with required flag', () => {
      dateTimePicker.name = 'foo';
      dateTimePicker.required = true;

      expect(dateTimePicker.validate()).to.equal(false);
      expect(dateTimePicker.invalid).to.equal(true);

      dateTimePicker.value = '2020-02-02T02:02:00';
      expect(dateTimePicker.validate()).to.equal(true);
      expect(dateTimePicker.invalid).to.equal(false);
    });

    ['date-picker', 'time-picker'].forEach((pickerType) => {
      function getPicker(pickerType) {
        return pickerType === 'date-picker' ? datePicker : timePicker;
      }

      function getOtherPickerType(pickerType) {
        return pickerType === 'date-picker' ? 'time-picker' : 'date-picker';
      }

      function getPickerInitialValue(pickerType) {
        return pickerType === 'date-picker' ? '2/2/2022' : '02:02';
      }

      function getPickerNewValue(pickerType) {
        return pickerType === 'date-picker' ? '1/1/2023' : '13:00';
      }

      async function triggerInputChange(trigger) {
        if (trigger === 'outside click') {
          outsideClick();
        } else {
          await sendKeys({ press: 'Enter' });
        }
      }

      async function clearValueOnFocusedInput(trigger) {
        await sendKeys({ press: 'ControlOrMeta+A' });
        await sendKeys({ press: 'Backspace' });
        await triggerInputChange(trigger);
        await nextRender();
      }

      async function changeValueOnFocusedInput(newValue, trigger) {
        await sendKeys({ press: 'ControlOrMeta+A' });
        await sendKeys({ type: newValue });
        await triggerInputChange(trigger);
        await nextRender();
      }

      async function initializePickerState(pickerType, initialState) {
        if (initialState === 'empty') {
          return;
        }
        const picker = getPicker(pickerType);
        picker.focus();
        const value = initialState === 'parsable' ? getPickerInitialValue(pickerType) : 'unparsableInitial';
        await changeValueOnFocusedInput(value);
        picker.blur();
      }

      async function changeStateOnFocusedInput(pickerType, newPickerState, trigger) {
        if (newPickerState === 'empty') {
          await clearValueOnFocusedInput(trigger);
        } else {
          const newValue = newPickerState === 'unparsable' ? 'unparsableNew' : getPickerNewValue(pickerType);
          await changeValueOnFocusedInput(newValue, trigger);
        }
      }

      async function initializeAndFocus(pickerType, pickerInitialState, otherPickerInitialState) {
        await initializePickerState(pickerType, pickerInitialState);
        await initializePickerState(getOtherPickerType(pickerType), otherPickerInitialState);
        validateSpy.resetHistory();
        getPicker(pickerType).focus();
      }

      it(`should validate on ${pickerType} outside click when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'empty');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'empty');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} outside click when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should not validate on ${pickerType} enter when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.false;
      });

      it(`should validate on ${pickerType} enter when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should not validate on ${pickerType} enter when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'empty');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.false;
      });

      it(`should validate on ${pickerType} enter when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'empty');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });

      it(`should validate on ${pickerType} enter when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.true;
      });
    });

    it('should validate on date-picker enter when value is changed to a date outside the set range while time-picker is empty', async () => {
      dateTimePicker.min = '1980-02-02T02:00';
      dateTimePicker.max = '1990-02-02T02:00';
      validateSpy.resetHistory();
      datePicker.focus();
      await sendKeys({ press: 'ControlOrMeta+A' });
      await sendKeys({ type: '2/2/2022' });
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(validateSpy.called).to.be.true;
    });

    it('should validate on date-picker outside click when value is changed to a date outside the set range while time-picker is empty', async () => {
      dateTimePicker.min = '1980-02-02T02:00';
      dateTimePicker.max = '1990-02-02T02:00';
      validateSpy.resetHistory();
      datePicker.focus();
      await sendKeys({ press: 'ControlOrMeta+A' });
      await sendKeys({ type: '2/2/2022' });
      outsideClick();
      await nextRender();
      expect(validateSpy.called).to.be.true;
    });

    it('should not validate on date-picker enter when value is changed to a date inside the set range while time-picker is empty', async () => {
      dateTimePicker.min = '1980-02-02T02:00';
      dateTimePicker.max = '1990-02-02T02:00';
      validateSpy.resetHistory();
      datePicker.focus();
      await sendKeys({ press: 'ControlOrMeta+A' });
      await sendKeys({ type: '2/2/1985' });
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should validate on date-picker outside click when value is changed to a date inside the set range while time-picker is empty', async () => {
      dateTimePicker.min = '1980-02-02T02:00';
      dateTimePicker.max = '1990-02-02T02:00';
      validateSpy.resetHistory();
      datePicker.focus();
      await sendKeys({ press: 'ControlOrMeta+A' });
      await sendKeys({ type: '2/2/1985' });
      outsideClick();
      await nextRender();
      expect(validateSpy.called).to.be.true;
    });

    it('should not validate on time-picker enter when value is changed while date-picker is empty and a range is set', async () => {
      dateTimePicker.min = '1980-02-02T02:00';
      dateTimePicker.max = '1990-02-02T02:00';
      validateSpy.resetHistory();
      timePicker.focus();
      await sendKeys({ press: 'ControlOrMeta+A' });
      await sendKeys({ type: '02:00' });
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should validate on time-picker outside click when value is changed while date-picker is empty and a range is set', async () => {
      dateTimePicker.min = '1980-02-02T02:00';
      dateTimePicker.max = '1990-02-02T02:00';
      validateSpy.resetHistory();
      timePicker.focus();
      await sendKeys({ press: 'ControlOrMeta+A' });
      await sendKeys({ type: '02:00' });
      outsideClick();
      await nextRender();
      expect(validateSpy.called).to.be.true;
    });

    it('should not validate on date-picker if value is temporarily changed', async () => {
      dateTimePicker.max = '1995-02-02T02:00';
      dateTimePicker.min = '1990-02-02T02:00';
      validateSpy.resetHistory();
      datePicker.focus();
      await sendKeys({ type: 'a' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate on time-picker if value is temporarily changed', async () => {
      dateTimePicker.max = '1995-02-02T02:00';
      dateTimePicker.min = '1990-02-02T02:00';
      validateSpy.resetHistory();
      timePicker.focus();
      await sendKeys({ type: 'a' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate on date-picker blur if the initial value is left unchanged', () => {
      datePicker.focus();
      datePicker.blur();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate on time-picker blur if the initial value is left unchanged', () => {
      timePicker.focus();
      timePicker.blur();
      expect(validateSpy.called).to.be.false;
    });

    it('should validate before change event on date-picker change', async () => {
      timePicker.value = '12:00';
      datePicker.focus();
      await sendKeys({ type: '1/1/2023' });
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should validate before change event on time-picker change', async () => {
      datePicker.value = '2023-01-01';
      timePicker.focus();
      await sendKeys({ type: '12:00' });
      await sendKeys({ press: 'Enter' });
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    it('should not validate when moving focus between pickers', async () => {
      datePicker.focus();
      // Move focus to time-picker
      await sendKeys({ press: 'Tab' });

      // Wait to reduce flakiness
      await aTimeout(1);

      // Move focus to date-picker
      await sendKeys({ press: 'Shift+Tab' });
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when moving focus to the date-picker dropdown', async () => {
      datePicker.focus();
      await sendKeys({ press: 'ArrowDown' });
      await untilOverlayRendered(datePicker);
      await sendKeys({ press: 'Tab' });
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate on min change without value', () => {
      dateTimePicker.min = '2020-02-02T02:00';
      expect(validateSpy.called).to.be.false;
    });

    it('should validate on min change with value', () => {
      dateTimePicker.value = '2020-02-02T02:00';
      validateSpy.resetHistory();
      dateTimePicker.min = '2020-02-02T02:00';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should not validate on max change without value', () => {
      dateTimePicker.max = '2020-02-02T02:00';
      expect(validateSpy.called).to.be.false;
    });

    it('should validate on max change with value', () => {
      dateTimePicker.value = '2020-02-02T02:00';
      validateSpy.resetHistory();
      dateTimePicker.max = '2020-02-02T02:00';
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate min/max times', () => {
      dateTimePicker.min = '2020-02-02T02:00';
      dateTimePicker.max = '2020-02-02T04:00';

      // Set invalid value.
      dateTimePicker.value = '2020-02-02T01:00';
      expect(dateTimePicker.validate()).to.equal(false);
      expect(dateTimePicker.invalid).to.equal(true);

      dateTimePicker.value = '2020-02-02T03:00';
      expect(dateTimePicker.validate()).to.equal(true);
      expect(dateTimePicker.invalid).to.equal(false);
    });

    it('should validate min/max dates', () => {
      dateTimePicker.min = '2020-02-01T02:00';
      dateTimePicker.max = '2020-02-03T04:00';

      // Set invalid value.
      dateTimePicker.value = '2020-02-04T03:00';
      expect(dateTimePicker.validate()).to.equal(false);
      expect(dateTimePicker.invalid).to.equal(true);

      dateTimePicker.value = '2020-02-02T03:00';
      expect(dateTimePicker.validate()).to.equal(true);
      expect(dateTimePicker.invalid).to.equal(false);
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      dateTimePicker.addEventListener('validated', validatedSpy);
      dateTimePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      dateTimePicker.addEventListener('validated', validatedSpy);
      dateTimePicker.required = true;
      dateTimePicker.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });

    describe('required', () => {
      beforeEach(async () => {
        dateTimePicker.required = true;
        await nextFrame();
      });

      it('should not be invalid without user interactions', () => {
        expect(dateTimePicker.invalid).to.be.false;
      });

      it('should be invalid after validate() if value is not set', () => {
        dateTimePicker.validate();
        expect(dateTimePicker.invalid).to.be.true;
      });

      it('should validate when setting required to false', async () => {
        dateTimePicker.required = false;
        await nextFrame();
        expect(validateSpy).to.be.calledOnce;
      });
    });

    describe('document losing focus', () => {
      beforeEach(() => {
        sinon.stub(document, 'hasFocus').returns(false);
      });

      afterEach(() => {
        document.hasFocus.restore();
      });

      it('should not validate on date-picker blur when document does not have focus', () => {
        datePicker.focus();
        datePicker.blur();
        expect(validateSpy.called).to.be.false;
      });

      it('should not validate on time-picker blur when document does not have focus', () => {
        timePicker.focus();
        timePicker.blur();
        expect(validateSpy.called).to.be.false;
      });
    });
  });
});

describe('initial validation', () => {
  let validateSpy, dateTimePicker;

  beforeEach(() => {
    dateTimePicker = document.createElement('vaadin-date-time-picker');
    validateSpy = sinon.spy(dateTimePicker, 'validate');
  });

  afterEach(() => {
    dateTimePicker.remove();
  });

  it('should not validate without value', async () => {
    document.body.appendChild(dateTimePicker);
    await nextRender();
    expect(validateSpy.called).to.be.false;
  });

  describe('with value', () => {
    beforeEach(() => {
      dateTimePicker.value = '2020-02-01T02:00';
    });

    it('should not validate without constraints', async () => {
      document.body.appendChild(dateTimePicker);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate without constraints when the field has invalid', async () => {
      dateTimePicker.invalid = true;
      document.body.appendChild(dateTimePicker);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should validate when the field has min', async () => {
      dateTimePicker.min = '2020-02-01T02:00';
      document.body.appendChild(dateTimePicker);
      await nextRender();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate when the field has max', async () => {
      dateTimePicker.max = '2020-02-01T02:00';
      document.body.appendChild(dateTimePicker);
      await nextRender();
      expect(validateSpy.calledOnce).to.be.true;
    });
  });
});

describe('custom validator', () => {
  let dateTimePicker;

  beforeEach(async () => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker-2020></vaadin-date-time-picker-2020>');
    await nextRender();
  });

  it('should validate correctly with custom validator', () => {
    // Try invalid value.
    dateTimePicker.value = '2030-03-03T20:30';
    expect(dateTimePicker.validate()).to.equal(false);
    expect(dateTimePicker.invalid).to.equal(true);

    // Try valid value.
    dateTimePicker.value = '2020-02-02T20:20';
    expect(dateTimePicker.validate()).to.equal(true);
    expect(dateTimePicker.invalid).to.equal(false);
  });
});
