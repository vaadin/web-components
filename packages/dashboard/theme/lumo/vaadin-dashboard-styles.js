import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dashboardLayoutStyles } from './vaadin-dashboard-layout-styles.js';

registerStyles('vaadin-dashboard', [dashboardLayoutStyles], {
  moduleId: 'lumo-dashboard',
});
