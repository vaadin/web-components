import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-radio-group',
  css`
    /* Show error message immediately */
    [part='error-message'] {
      animation: none !important;
      transition: none !important;
    }
  `,
);
