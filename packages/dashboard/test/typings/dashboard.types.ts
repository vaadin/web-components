import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { DashboardLayoutMixinClass } from '../../src/vaadin-dashboard-layout-mixin.js';
import type { Dashboard } from '../../vaadin-dashboard.js';
import type { DashboardLayout } from '../../vaadin-dashboard-layout.js';
import type { DashboardWidget } from '../../vaadin-dashboard-widget.js';

const assertType = <TExpected>(actual: TExpected) => actual;

/* Dashboard */
const dashboard = document.createElement('vaadin-dashboard');
assertType<Dashboard>(dashboard);

assertType<ElementMixinClass>(dashboard);
assertType<DashboardLayoutMixinClass>(dashboard);

/* DashboardLayout */
const layout = document.createElement('vaadin-dashboard-layout');
assertType<DashboardLayout>(layout);

assertType<ElementMixinClass>(layout);
assertType<DashboardLayoutMixinClass>(layout);

/* DashboardWidget */
const widget = document.createElement('vaadin-dashboard-widget');
assertType<DashboardWidget>(widget);

assertType<string | null | undefined>(widget.widgetTitle);
