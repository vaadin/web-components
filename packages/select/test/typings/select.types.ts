import '../../vaadin-select.js';
import {
  Select,
  SelectInvalidChangedEvent,
  SelectItem,
  SelectOpenedChangedEvent,
  SelectRenderer,
  SelectValueChangedEvent
} from '../../vaadin-select.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const select: Select = document.createElement('vaadin-select');

// Properties
assertType<SelectItem[] | null | undefined>(select.items);
assertType<boolean>(select.opened);
assertType<SelectRenderer | undefined>(select.renderer);
assertType<string>(select.value);
assertType<string | null | undefined>(select.placeholder);
assertType<boolean | null | undefined>(select.readonly);
assertType<() => void>(select.requestContentUpdate);
assertType<() => boolean>(select.validate);

// Events
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
