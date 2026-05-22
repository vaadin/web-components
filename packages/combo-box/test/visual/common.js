import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Keep loader visible when animation is disabled */
registerStyles(
  'vaadin-combo-box-overlay',
  css`
    :host([loading]) [part='loader'] {
      opacity: 1;
    }
  `,
);
