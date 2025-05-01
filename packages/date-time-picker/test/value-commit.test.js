import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-time-picker.js';
import { untilOverlayRendered } from '@vaadin/date-picker/test/helpers.js';
import { changeInputValue } from './helpers.js';

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
  describe(`Value commit (${set})`, () => {
    let dateTimePicker;
    let datePicker;
    let timePicker;
    let changeEventSpy;
    let unparsableChangeEventSpy;
    let validateSpy;

    beforeEach(async () => {
      dateTimePicker = fixtureSync(fixtures[set]);
      await nextRender();
      datePicker = dateTimePicker.querySelector('[slot=date-picker]');
      timePicker = dateTimePicker.querySelector('[slot=time-picker]');
      validateSpy = sinon.spy(dateTimePicker, 'validate');
      changeEventSpy = sinon.spy();
      dateTimePicker.addEventListener('change', changeEventSpy);
      unparsableChangeEventSpy = sinon.spy();
      dateTimePicker.addEventListener('unparsable-change', unparsableChangeEventSpy);
    });

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
      changeEventSpy.resetHistory();
      unparsableChangeEventSpy.resetHistory();
      getPicker(pickerType).focus();
    }

    ['date-picker', 'time-picker'].forEach((pickerType) => {
      it(`should validate and fire change on ${pickerType} outside click when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.true;
        expect(unparsableChangeEventSpy.called).to.false;
      });

      it(`should validate and fire change on ${pickerType} outside click when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.true;
        expect(unparsableChangeEventSpy.called).to.false;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire change on ${pickerType} outside click when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.true;
        expect(unparsableChangeEventSpy.called).to.false;
      });

      it(`should validate and fire change on ${pickerType} outside click when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.true;
        expect(unparsableChangeEventSpy.called).to.false;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'empty');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'empty');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'empty', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} outside click when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'outside click');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire change on ${pickerType} enter when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.true;
        expect(unparsableChangeEventSpy.called).to.false;
      });

      it(`should not validate or fire any change events on ${pickerType} enter when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.false;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.false;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire change on ${pickerType} enter when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.true;
        expect(unparsableChangeEventSpy.called).to.false;
      });

      it(`should validate and fire change on ${pickerType} enter when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is parsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'parsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.true;
        expect(unparsableChangeEventSpy.called).to.false;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is unparsable`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'unparsable');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should not or fire any change events validate on ${pickerType} enter when value is changed from empty to parsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'empty');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.false;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.false;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from parsable to empty when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from empty to unparsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'empty', 'empty');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from unparsable to empty when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'empty', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from parsable to unparsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'parsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'unparsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
      });

      it(`should validate and fire unparsable-change on ${pickerType} enter when value is changed from unparsable to parsable when ${getOtherPickerType(pickerType)} value is empty`, async () => {
        await initializeAndFocus(pickerType, 'unparsable', 'empty');
        await changeStateOnFocusedInput(pickerType, 'parsable', 'enter');
        expect(validateSpy.called).to.be.true;
        expect(changeEventSpy.called).to.be.false;
        expect(unparsableChangeEventSpy.called).to.true;
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

    it('should validate before change event on date-picker change', async () => {
      timePicker.value = '12:00';
      datePicker.focus();
      await sendKeys({ type: '1/1/2023' });
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(changeEventSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeEventSpy)).to.be.true;
    });

    it('should validate before change event on time-picker change', async () => {
      datePicker.value = '2023-01-01';
      timePicker.focus();
      await sendKeys({ type: '12:00' });
      await sendKeys({ press: 'Enter' });
      expect(changeEventSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeEventSpy)).to.be.true;
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

    it('should not fire change on programmatic value change', () => {
      dateTimePicker.value = '2020-01-17T16:00';
      expect(changeEventSpy.called).to.be.false;
    });

    it('should not fire change on programmatic value change after manual one', () => {
      dateTimePicker.value = '2020-01-17T16:00'; // Init with valid value
      changeInputValue(datePicker, '2020-01-20');
      changeEventSpy.resetHistory();
      dateTimePicker.value = '2020-01-10T12:00';
      expect(changeEventSpy.called).to.be.false;
    });

    it('should not fire change on programmatic value change after partial manual one', () => {
      changeInputValue(datePicker, '2020-01-17');
      // Time picker has no value so date time picker value is still empty
      dateTimePicker.value = '2020-01-17T16:00';
      expect(changeEventSpy.called).to.be.false;
    });

    it('should validate on date-picker blur', () => {
      datePicker.focus();
      datePicker.blur();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on time-picker blur', () => {
      timePicker.focus();
      timePicker.blur();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on date-picker overlay closed by outside click', async () => {
      datePicker.click();
      await nextRender();
      outsideClick();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate on time-picker overlay closed by outside click', async () => {
      timePicker.click();
      await nextRender();
      outsideClick();
      expect(validateSpy.calledOnce).to.be.true;
    });
  });
});
