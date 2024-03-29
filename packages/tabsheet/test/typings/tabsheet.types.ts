import '../../vaadin-tabsheet.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { Tab } from '@vaadin/tabs/src/vaadin-tab.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { TabSheetItemsChangedEvent, TabSheetSelectedChangedEvent } from '../../vaadin-tabsheet.js';

const tabsheet = document.createElement('vaadin-tabsheet');

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<ThemePropertyMixinClass>(tabsheet);
assertType<DelegateStateMixinClass>(tabsheet);

tabsheet.addEventListener('items-changed', (event) => {
  assertType<TabSheetItemsChangedEvent>(event);
  assertType<Tab[]>(event.detail.value);
});

tabsheet.addEventListener('selected-changed', (event) => {
  assertType<TabSheetSelectedChangedEvent>(event);
  assertType<number>(event.detail.value);
});

assertType<Tab[] | undefined>(tabsheet.items);

assertType<ThemableMixinClass>(tabsheet);
