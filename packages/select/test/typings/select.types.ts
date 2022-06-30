import '../../vaadin-select.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type {
  Select,
  SelectChangeEvent,
  SelectInvalidChangedEvent,
  SelectItem,
  SelectOpenedChangedEvent,
  SelectRenderer,
  SelectValidatedEvent,
  SelectValueChangedEvent,
} from '../../vaadin-select.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const select: Select = document.createElement('vaadin-select');

// Properties
assertType<SelectItem[] | null | undefined>(select.items);
assertType<boolean>(select.opened);
assertType<SelectRenderer | undefined>(select.renderer);
assertType<string>(select.value);
assertType<string | null | undefined>(select.placeholder);
assertType<boolean>(select.readonly);
assertType<boolean>(select.invalid);
assertType<boolean>(select.required);
assertType<() => void>(select.requestContentUpdate);
assertType<() => boolean>(select.validate);

// Mixins
assertType<ValidateMixinClass>(select);

// Item properties
const item: SelectItem = select.items ? select.items[0] : {};
assertType<string | undefined>(item.label);
assertType<string | undefined>(item.value);
assertType<boolean | undefined>(item.disabled);
assertType<string | undefined>(item.component);

// Events
select.addEventListener('change', (event) => {
  assertType<SelectChangeEvent>(event);
  assertType<Select>(event.target);
});

select.addEventListener('opened-changed', (event) => {
  assertType<SelectOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

select.addEventListener('invalid-changed', (event) => {
  assertType<SelectInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

select.addEventListener('value-changed', (event) => {
  assertType<SelectValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

select.addEventListener('validated', (event) => {
  assertType<SelectValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
