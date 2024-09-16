import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { TitleController } from '../../src/title-controller.js';
import type { DashboardLayoutMixinClass } from '../../src/vaadin-dashboard-layout-mixin.js';
import type {
  Dashboard,
  DashboardItem,
  DashboardItemDragReorderEvent,
  DashboardItemDragResizeEvent,
  DashboardItemRemoveEvent,
  DashboardItemReorderEndEvent,
  DashboardItemReorderStartEvent,
  DashboardItemResizeEndEvent,
  DashboardItemResizeStartEvent,
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

narrowedDashboard.addEventListener('dashboard-item-reorder-start', (event) => {
  assertType<DashboardItemReorderStartEvent>(event);
});

narrowedDashboard.addEventListener('dashboard-item-reorder-end', (event) => {
  assertType<DashboardItemReorderEndEvent>(event);
});

narrowedDashboard.addEventListener('dashboard-item-drag-reorder', (event) => {
  assertType<DashboardItemDragReorderEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>(event.detail.item);
  assertType<number>(event.detail.targetIndex);
});

narrowedDashboard.addEventListener('dashboard-item-resize-start', (event) => {
  assertType<DashboardItemResizeStartEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item);
});

narrowedDashboard.addEventListener('dashboard-item-resize-end', (event) => {
  assertType<DashboardItemResizeEndEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item);
});

narrowedDashboard.addEventListener('dashboard-item-drag-resize', (event) => {
  assertType<DashboardItemDragResizeEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem>(event.detail.item);
  assertType<number>(event.detail.colspan);
  assertType<number>(event.detail.rowspan);
});

narrowedDashboard.addEventListener('dashboard-item-removed', (event) => {
  assertType<DashboardItemRemoveEvent<TestDashboardItem>>(event);
  assertType<TestDashboardItem | DashboardSectionItem<TestDashboardItem>>(event.detail.item);
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

/* DashboardSection */
const section = document.createElement('vaadin-dashboard-section');
assertType<DashboardSection>(section);

assertType<string | null | undefined>(section.sectionTitle);

/* TitleController */
const titleController = new TitleController(layout);
assertType<TitleController>(titleController);
assertType<(title: string | null | undefined) => void>(titleController.setTitle);
