import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-dashboard-layout',
  css`
    :host {
      --vaadin-dashboard-gap: 1rem;
    }
  `,
  {
    moduleId: 'material-dashboard-layout',
  },
);
