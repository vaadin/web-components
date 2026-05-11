import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-app-layout',
  css`
    :host(:not([no-anim])) {
      --vaadin-app-layout-transition-duration: 0s;
      transition-property: none;
    }
  `,
);
