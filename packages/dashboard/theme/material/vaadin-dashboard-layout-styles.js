import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const dashboardLayoutStyles = css`
  :host {
    --vaadin-dashboard-gap: 1rem;
  }
`;

registerStyles('vaadin-dashboard-layout', [dashboardLayoutStyles], {
  moduleId: 'material-dashboard-layout',
});
