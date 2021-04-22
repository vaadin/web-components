import '../../vaadin-radio-button.js';
import '../../vaadin-radio-group.js';

import { RadioButtonCheckedChangedEvent } from '../../vaadin-radio-button.js';
import { RadioGroupInvalidChangedEvent, RadioGroupValueChangedEvent } from '../../vaadin-radio-group.js';

const radio = document.createElement('vaadin-radio-button');

const assertType = <TExpected>(actual: TExpected) => actual;

radio.addEventListener('checked-changed', (event) => {
  assertType<RadioButtonCheckedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

const group = document.createElement('vaadin-radio-group');

group.addEventListener('invalid-changed', (event) => {
  assertType<RadioGroupInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

group.addEventListener('value-changed', (event) => {
  assertType<RadioGroupValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
