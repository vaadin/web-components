import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-select',
  css`
    /* Disable animation */
    [part='label'],
    [part='helper-text'],
    [part='error-message'],
    [part='required-indicator'] {
      &,
      &::before,
      &::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `,
);
