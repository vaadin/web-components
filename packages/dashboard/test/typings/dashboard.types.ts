import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { DashboardLayoutMixinClass } from '../../src/vaadin-dashboard-layout-mixin.js';
import type {
  Dashboard,
  DashboardI18n,
  DashboardItem,
  DashboardItemBeforeRemoveEvent,
  DashboardItemMovedEvent,
  DashboardItemMoveModeChangedEvent,
  DashboardItemRemovedEvent,
  DashboardItemResizedEvent,
  DashboardItemResizeModeChangedEvent,
  DashboardItemSelectedChangedEvent,
  DashboardRenderer,
  DashboardSectionItem,
} from '../../vaadin-dashboard.js';
import type { DashboardLayout } from '../../vaadin-dashboard-layout.js';
import type { DashboardSection } from '../../vaadin-dashboard-section.js';
import type { DashboardWidget } from '../../vaadin-dashboard-widget.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestDashboardItem extends DashboardItem {
  testProperty: string;
}

/* Dashboard */
const genericDashboard = document.createElement('vaadin-dashboard');
assertType<Dashboard>(genericDashboard);

assertType<{ colspan?: number; rowspan?: number }>(genericDashboard.items[0] as DashboardItem);
assertType<{ items: DashboardItem[]; title?: string }>(
  genericDashboard.items[0] as DashboardSectionItem<DashboardItem>,
);

assertType<ElementMixinClass>(genericDashboard);
assertType<I18nMixinClass<DashboardI18n>>(genericDashboard);
assertType<DashboardLayoutMixinClass>(genericDashboard);
assertType<Array<DashboardItem | DashboardSectionItem<DashboardItem>> | null | undefined>(genericDashboard.items);
assertType<boolean>(genericDashboard.editable);
assertType<boolean>(genericDashboard.denseLayout);

assertType<{
  selectWidget?: string;
  selectSection?: string;
  remove?: string;
  resize?: string;
  move?: string;
  resizeApply?: string;
  resizeShrinkWidth?: string;
  resizeGrowWidth?: string;
  resizeShrinkHeight?: string;
  resizeGrowHeight?: string;
  moveApply?: string;
  moveForward?: string;
  moveBackward?: string;
}>(genericDashboard.i18n);

const narrowedDashboard = document.createElement('vaadin-dashboard') as unknown as Dashboard<TestDashboardItem>;
assertType<Dashboard<TestDashboardItem>>(narrowedDashboard);
assertType<Array<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>>(narrowedDashboard.items);
assertType<DashboardRenderer<TestDashboardItem> | null | undefined>(narrowedDashboard.renderer);
assertType<
  | { colspan?: number; rowspan?: number; id?: unknown; testProperty: string }
  | { title?: string | null; items: Array<{ colspan?: number; rowspan?: number; testProperty: string }> }
>(narrowedDashboard.items[0]);

const item = narrowedDashboard.items[0] as TestDashboardItem;
assertType<unknown | undefined>(item.id);
assertType<string>(item.testProperty);
assertType<number | undefined>(item.colspan);
assertType<number | undefined>(item.rowspan);

const sectionItem = narrowedDashboard.items[0] as DashboardSectionItem<TestDashboardItem>;
assertType<unknown | undefined>(sectionItem.id);
assertType<string | null | undefined>(sectionItem.title);
assertType<Array<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>>(sectionItem.items);

narrowedDashboard.addEventListener('dashboard-item-moved', (event) => {
  assertType<DashboardItemMovedEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item as TestDashboardItem);
  assertType<DashboardSectionItem<TestDashboardItem>>(event.detail.item as DashboardSectionItem<TestDashboardItem>);
  assertType<Array<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>>(event.detail.items);
  assertType<DashboardSectionItem<TestDashboardItem> | undefined>(event.detail.section);
});

narrowedDashboard.addEventListener('dashboard-item-resized', (event) => {
  assertType<DashboardItemResizedEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item);
  assertType<Array<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>>(event.detail.items);
});

narrowedDashboard.addEventListener('dashboard-item-before-remove', (event) => {
  assertType<DashboardItemBeforeRemoveEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item as TestDashboardItem);
  assertType<DashboardSectionItem<TestDashboardItem>>(event.detail.item as DashboardSectionItem<TestDashboardItem>);
  assertType<Array<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>>(event.detail.items);
});

narrowedDashboard.addEventListener('dashboard-item-removed', (event) => {
  assertType<DashboardItemRemovedEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item as TestDashboardItem);
  assertType<DashboardSectionItem<TestDashboardItem>>(event.detail.item as DashboardSectionItem<TestDashboardItem>);
  assertType<Array<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>>(event.detail.items);
});

narrowedDashboard.addEventListener('dashboard-item-selected-changed', (event) => {
  assertType<DashboardItemSelectedChangedEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item as TestDashboardItem);
  assertType<DashboardSectionItem<TestDashboardItem>>(event.detail.item as DashboardSectionItem<TestDashboardItem>);
  assertType<boolean>(event.detail.value);
});

narrowedDashboard.addEventListener('dashboard-item-move-mode-changed', (event) => {
  assertType<DashboardItemMoveModeChangedEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item as TestDashboardItem);
  assertType<DashboardSectionItem<TestDashboardItem>>(event.detail.item as DashboardSectionItem<TestDashboardItem>);
  assertType<boolean>(event.detail.value);
});

narrowedDashboard.addEventListener('dashboard-item-resize-mode-changed', (event) => {
  assertType<DashboardItemResizeModeChangedEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item);
  assertType<boolean>(event.detail.value);
});

/* DashboardLayout */
const layout = document.createElement('vaadin-dashboard-layout');
assertType<DashboardLayout>(layout);
assertType<boolean>(layout.denseLayout);

assertType<ElementMixinClass>(layout);
assertType<DashboardLayoutMixinClass>(layout);

/* DashboardWidget */
const widget = document.createElement('vaadin-dashboard-widget');
assertType<DashboardWidget>(widget);

assertType<string | null | undefined>(widget.widgetTitle);

/* DashboardSection */
const section = document.createElement('vaadin-dashboard-section');
assertType<DashboardSection>(section);

assertType<string | null | undefined>(section.sectionTitle);
