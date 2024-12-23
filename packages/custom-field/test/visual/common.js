import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-custom-field vaadin-date-picker vaadin-number-field vaadin-text-field',
  css`
    /* Show error message immediately */
    [part='error-message'] {
      animation: none !important;
      transition: none !important;
    }
  `,
);
