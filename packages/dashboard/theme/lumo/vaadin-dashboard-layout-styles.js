import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const dashboardLayoutStyles = css`
  #grid {
    --_vaadin-dashboard-default-gap: var(--lumo-space-m);
    --_vaadin-dashboard-default-padding: var(--lumo-space-m);
  }
`;

registerStyles('vaadin-dashboard-layout', [dashboardLayoutStyles], {
  moduleId: 'lumo-dashboard-layout',
});
