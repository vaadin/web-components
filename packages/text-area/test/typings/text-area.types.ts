import '../../vaadin-text-area.js';
import { TextAreaInvalidChangedEvent, TextAreaValueChangedEvent } from '../../vaadin-text-area.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const area = document.createElement('vaadin-text-area');

area.addEventListener('invalid-changed', (event) => {
  assertType<TextAreaInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

area.addEventListener('value-changed', (event) => {
  assertType<TextAreaValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
