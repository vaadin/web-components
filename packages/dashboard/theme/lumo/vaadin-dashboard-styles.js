import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dashboardLayoutStyles } from './vaadin-dashboard-layout-styles.js';

const dashboard = css`
  :host {
    --_vaadin-dashboard-widget-opacity: 1;
  }

  :host([item-selected]) {
    --_vaadin-dashboard-widget-opacity: 0.7;
  }
`;

registerStyles('vaadin-dashboard', [dashboardLayoutStyles, dashboard], {
  moduleId: 'lumo-dashboard',
});
