import '../../vaadin-radio-button.js';
import '../../vaadin-radio-group.js';

import { RadioButtonCheckedChanged } from '../../vaadin-radio-button.js';
import { RadioGroupInvalidChanged, RadioGroupValueChanged } from '../../vaadin-radio-group.js';

const radio = document.createElement('vaadin-radio-button');

const assertType = <TExpected>(actual: TExpected) => actual;

radio.addEventListener('checked-changed', (event) => {
  assertType<RadioButtonCheckedChanged>(event);
});

const group = document.createElement('vaadin-radio-group');

group.addEventListener('invalid-changed', (event) => {
  assertType<RadioGroupInvalidChanged>(event);
});

group.addEventListener('value-changed', (event) => {
  assertType<RadioGroupValueChanged>(event);
});
