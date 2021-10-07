import '../../vaadin-tabs.js';

import { TabsItemsChangedEvent, TabsSelectedChangedEvent } from '../../vaadin-tabs.js';

const tabs = document.createElement('vaadin-tabs');

const assertType = <TExpected>(actual: TExpected) => actual;

tabs.addEventListener('items-changed', (event) => {
  assertType<TabsItemsChangedEvent>(event);
  assertType<Element[]>(event.detail.value);
});

tabs.addEventListener('selected-changed', (event) => {
  assertType<TabsSelectedChangedEvent>(event);
  assertType<number>(event.detail.value);
});
