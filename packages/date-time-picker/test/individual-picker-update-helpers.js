import { sendKeys } from '@vaadin/test-runner-commands';
import { nextRender, outsideClick } from '@vaadin/testing-helpers';

async function triggerInputChange(trigger) {
  if (trigger === 'outside click') {
    outsideClick();
  } else {
    await sendKeys({ press: 'Enter' });
  }
}

const inputChangeTriggers = ['outside click', 'enter'];

export const clearValueOnFocusedInput = async (trigger) => {
  await sendKeys({ press: 'ControlOrMeta+A' });
  await sendKeys({ press: 'Backspace' });
  await triggerInputChange(trigger);
  await nextRender();
};

export const changeValueOnFocusedInput = async (newValue, trigger) => {
  await sendKeys({ press: 'ControlOrMeta+A' });
  await sendKeys({ type: newValue });
  await triggerInputChange(trigger);
  await nextRender();
};

export const getPicker = (dateTimePicker, pickerType) => {
  return pickerType === 'date-picker' ? dateTimePicker.__datePicker : dateTimePicker.__timePicker;
};

export const getOtherPickerType = (pickerType) => {
  return pickerType === 'date-picker' ? 'time-picker' : 'date-picker';
};

export const getPickerInitialValue = (pickerType) => {
  return pickerType === 'date-picker' ? '2/2/2022' : '02:02';
};

export const getPickerNewValue = (pickerType) => {
  return pickerType === 'date-picker' ? '1/1/2023' : '13:00';
};

export const changeStateOnFocusedInput = async (pickerType, newPickerState, trigger) => {
  if (newPickerState === 'empty') {
    await clearValueOnFocusedInput(trigger);
  } else {
    const newValue = newPickerState === 'unparsable' ? 'unparsableNew' : getPickerNewValue(pickerType);
    await changeValueOnFocusedInput(newValue, trigger);
  }
};

export const initializePickerState = async (dateTimePicker, pickerType, initialState) => {
  if (initialState === 'empty') {
    return;
  }
  const picker = getPicker(dateTimePicker, pickerType);
  picker.focus();
  const value = initialState === 'parsable' ? getPickerInitialValue(pickerType) : 'unparsableInitial';
  await changeValueOnFocusedInput(value);
  picker.blur();
};

export const initializePickerStates = async (
  dateTimePicker,
  pickerType,
  pickerInitialState,
  otherPickerInitialState,
) => {
  await initializePickerState(dateTimePicker, pickerType, pickerInitialState);
  await initializePickerState(dateTimePicker, getOtherPickerType(pickerType), otherPickerInitialState);
};

export const individualPickerUpdateTestSetup = (individualPickerTest) => {
  ['date-picker', 'time-picker'].forEach((pickerType) => {
    const pickerStates = ['empty', 'parsable', 'unparsable'];
    pickerStates.forEach((pickerInitialState) => {
      pickerStates.forEach((otherPickerInitialState) => {
        const newPickerStates = [...pickerStates].filter((state) => state !== pickerInitialState);
        newPickerStates.forEach((pickerNewState) => {
          inputChangeTriggers.forEach((inputChangeTrigger) => {
            individualPickerTest(
              pickerType,
              pickerInitialState,
              pickerNewState,
              otherPickerInitialState,
              inputChangeTrigger,
            );
          });
        });
      });
    });
  });
};
