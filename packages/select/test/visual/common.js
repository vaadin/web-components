import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-select',
  css`
    /* Show error message immediately */
    [part='error-message'] {
      transition: none !important;
    }
  `,
);
