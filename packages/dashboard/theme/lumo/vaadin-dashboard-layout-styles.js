import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const dashboardLayoutStyles = css`
  #grid {
    --_vaadin-dashboard-default-gap: var(--lumo-space-l);
    --_vaadin-dashboard-default-padding: var(--lumo-space-l);
  }
`;

registerStyles('vaadin-dashboard-layout', [dashboardLayoutStyles], {
  moduleId: 'lumo-dashboard-layout',
});
