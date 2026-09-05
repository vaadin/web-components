import '../../vaadin-masked-field.js';
import type { FormatMixinClass } from '../../src/format-mixin.js';
import type { InputFormatMixinClass } from '../../src/input-format-mixin.js';
import type {
  MaskedField,
  MaskedFieldChangeEvent,
  MaskedFieldInvalidChangedEvent,
  MaskedFieldValidatedEvent,
  MaskedFieldValueChangedEvent,
} from '../../vaadin-masked-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-masked-field');

// Mixins
assertType<FormatMixinClass>(field);
assertType<InputFormatMixinClass>(field);

// Properties
assertType<number[] | undefined>(field.formatBlocks);
assertType<string | undefined>(field.formatDelimiter);
assertType<string | undefined>(field.formatTextCase);
assertType<string | undefined>(field.formatMask);
assertType<string>(field.formattedValue);

// Events
field.addEventListener('change', (event) => {
  assertType<MaskedFieldChangeEvent>(event);
  assertType<MaskedField>(event.target);
});

field.addEventListener('invalid-changed', (event) => {
  assertType<MaskedFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<MaskedFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

field.addEventListener('validated', (event) => {
  assertType<MaskedFieldValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
