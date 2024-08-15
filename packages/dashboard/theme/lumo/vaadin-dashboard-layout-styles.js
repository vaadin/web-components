import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-dashboard-layout',
  css`
    :host {
      --vaadin-dashboard-gap: var(--lumo-space-m);
    }
  `,
  {
    moduleId: 'lumo-dashboard-layout',
  },
);
