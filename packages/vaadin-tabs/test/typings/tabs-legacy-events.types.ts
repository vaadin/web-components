import '../../vaadin-tabs.js';

import { TabsItemsChanged, TabsSelectedChanged } from '../../vaadin-tabs.js';

const tabs = document.createElement('vaadin-tabs');

const assertType = <TExpected>(actual: TExpected) => actual;

tabs.addEventListener('items-changed', (event) => {
  assertType<TabsItemsChanged>(event);
});

tabs.addEventListener('selected-changed', (event) => {
  assertType<TabsSelectedChanged>(event);
});
