import '../../vaadin-list-box.js';
import type {
  ListBoxItemsChangedEvent,
  ListBoxSelectedChangedEvent,
  ListBoxSelectedValuesChangedEvent,
} from '../../vaadin-list-box.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const listBox = document.createElement('vaadin-list-box');

listBox.addEventListener('items-changed', (event) => {
  assertType<ListBoxItemsChangedEvent>(event);
  assertType<Element[]>(event.detail.value);
});

listBox.addEventListener('selected-changed', (event) => {
  assertType<ListBoxSelectedChangedEvent>(event);
  assertType<number>(event.detail.value);
});

listBox.addEventListener('selected-values-changed', (event) => {
  assertType<ListBoxSelectedValuesChangedEvent>(event);
  assertType<number[]>(event.detail.value);
});
