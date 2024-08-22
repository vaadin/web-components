import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { TitleController } from '../../src/title-controller.js';
import type { DashboardLayoutMixinClass } from '../../src/vaadin-dashboard-layout-mixin.js';
import type { Dashboard, DashboardItem, DashboardRenderer } from '../../vaadin-dashboard.js';
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

assertType<ElementMixinClass>(genericDashboard);
assertType<DashboardLayoutMixinClass>(genericDashboard);
assertType<DashboardItem[] | null | undefined>(genericDashboard.items);

const narrowedDashboard = document.createElement('vaadin-dashboard') as unknown as Dashboard<TestDashboardItem>;
assertType<Dashboard<TestDashboardItem>>(narrowedDashboard);
assertType<TestDashboardItem[]>(narrowedDashboard.items);
assertType<DashboardRenderer<TestDashboardItem> | null | undefined>(narrowedDashboard.renderer);
assertType<{ colspan?: number }>(narrowedDashboard.items[0]);

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
const titleController = new TitleController(layout, 'title');
assertType<TitleController>(titleController);
assertType<(title: string | null | undefined) => void>(titleController.setTitle);
