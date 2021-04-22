import '../../vaadin-select.js';

import { SelectInvalidChanged, SelectOpenedChanged, SelectValueChanged } from '../../vaadin-select.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const select = document.createElement('vaadin-select');

select.addEventListener('opened-changed', (event) => {
  assertType<SelectOpenedChanged>(event);
});

select.addEventListener('invalid-changed', (event) => {
  assertType<SelectInvalidChanged>(event);
});

select.addEventListener('value-changed', (event) => {
  assertType<SelectValueChanged>(event);
});
