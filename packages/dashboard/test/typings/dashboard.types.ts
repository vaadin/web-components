import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { DashboardLayoutMixinClass } from '../../src/vaadin-dashboard-layout-mixin.js';
import type {
  Dashboard,
  DashboardItem,
  DashboardItemMovedEvent,
  DashboardItemRemovedEvent,
  DashboardItemResizedEvent,
  DashboardRenderer,
  DashboardSectionItem,
} from '../../vaadin-dashboard.js';
import type { DashboardLayout } from '../../vaadin-dashboard-layout.js';
import type { DashboardSection, DashboardSectionI18n } from '../../vaadin-dashboard-section.js';
import type { DashboardWidget, DashboardWidgetI18n } from '../../vaadin-dashboard-widget.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestDashboardItem extends DashboardItem {
  testProperty: string;
}

/* Dashboard */
const genericDashboard = document.createElement('vaadin-dashboard');
assertType<Dashboard>(genericDashboard);

assertType<{ colspan?: number; rowspan?: number }>(genericDashboard.items[0] as DashboardItem);
assertType<{ items: DashboardItem[]; title?: string | null }>(
  genericDashboard.items[0] as DashboardSectionItem<DashboardItem>,
);

assertType<ElementMixinClass>(genericDashboard);
assertType<DashboardLayoutMixinClass>(genericDashboard);
assertType<Array<DashboardItem | DashboardSectionItem<DashboardItem>> | null | undefined>(genericDashboard.items);
assertType<boolean>(genericDashboard.editable);

const narrowedDashboard = document.createElement('vaadin-dashboard') as unknown as Dashboard<TestDashboardItem>;
assertType<Dashboard<TestDashboardItem>>(narrowedDashboard);
assertType<Array<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>>(narrowedDashboard.items);
assertType<DashboardRenderer<TestDashboardItem> | null | undefined>(narrowedDashboard.renderer);
assertType<
  | { colspan?: number; rowspan?: number; testProperty: string }
  | { title?: string | null; items: Array<{ colspan?: number; rowspan?: number; testProperty: string }> }
>(narrowedDashboard.items[0]);

narrowedDashboard.addEventListener('dashboard-item-moved', (event) => {
  assertType<DashboardItemMovedEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item);
  assertType<Array<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>>(event.detail.items);
  assertType<DashboardSectionItem<TestDashboardItem> | undefined>(event.detail.section);
});

narrowedDashboard.addEventListener('dashboard-item-resized', (event) => {
  assertType<DashboardItemResizedEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item);
  assertType<Array<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>>(event.detail.items);
});

narrowedDashboard.addEventListener('dashboard-item-removed', (event) => {
  assertType<DashboardItemRemovedEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>(event.detail.item);
  assertType<Array<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>>(event.detail.items);
});

/* DashboardLayout */
const layout = document.createElement('vaadin-dashboard-layout');
assertType<DashboardLayout>(layout);

assertType<ElementMixinClass>(layout);
assertType<DashboardLayoutMixinClass>(layout);

/* DashboardWidget */
const widget = document.createElement('vaadin-dashboard-widget');
assertType<DashboardWidget>(widget);

assertType<string | null | undefined>(widget.widgetTitle);

assertType<DashboardWidgetI18n>(widget.i18n);
assertType<{
  widget: {
    selectTitleForEditing: string;
  };
  remove: {
    title: string;
  };
  resize: {
    title: string;
    apply: string;
    shrinkWidth: string;
    growWidth: string;
    shrinkHeight: string;
    growHeight: string;
  };
  move: {
    title: string;
    apply: string;
    forward: string;
    backward: string;
  };
}>(widget.i18n);

/* DashboardSection */
const section = document.createElement('vaadin-dashboard-section');
assertType<DashboardSection>(section);

assertType<string | null | undefined>(section.sectionTitle);

assertType<DashboardSectionI18n>(section.i18n);
assertType<{
  section: {
    selectTitleForEditing: string;
  };
  remove: {
    title: string;
  };
  move: {
    title: string;
    apply: string;
    forward: string;
    backward: string;
  };
}>(section.i18n);
