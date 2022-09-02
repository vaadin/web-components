import '../../vaadin-tabsheet.js';
import type { Tab } from '@vaadin/tabs/src/vaadin-tab.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin';
import type { TabSheetItemsChangedEvent, TabSheetSelectedChangedEvent } from '../../vaadin-tabsheet.js';

const tabsheet = document.createElement('vaadin-tabsheet');

const assertType = <TExpected>(actual: TExpected) => actual;

tabsheet.addEventListener('items-changed', (event) => {
  assertType<TabSheetItemsChangedEvent>(event);
  assertType<Tab[]>(event.detail.value);
});

tabsheet.addEventListener('selected-changed', (event) => {
  assertType<TabSheetSelectedChangedEvent>(event);
  assertType<number>(event.detail.value);
});

assertType<ThemableMixinClass>(tabsheet);
