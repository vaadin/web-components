import '../../vaadin-list-box.js';
import { ListBoxItemsChanged, ListBoxSelectedChanged, ListBoxSelectedValuesChanged } from '../../vaadin-list-box.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const listBox = document.createElement('vaadin-list-box');

listBox.addEventListener('items-changed', (event) => {
  assertType<ListBoxItemsChanged>(event);
});

listBox.addEventListener('selected-changed', (event) => {
  assertType<ListBoxSelectedChanged>(event);
});

listBox.addEventListener('selected-values-changed', (event) => {
  assertType<ListBoxSelectedValuesChanged>(event);
});
