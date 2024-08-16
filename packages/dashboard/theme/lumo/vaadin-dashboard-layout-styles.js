import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const dashboardLayoutStyles = css`
  :host {
    --vaadin-dashboard-gap: var(--lumo-space-m);
  }
`;

registerStyles('vaadin-dashboard-layout', [dashboardLayoutStyles], {
  moduleId: 'lumo-dashboard-layout',
});
