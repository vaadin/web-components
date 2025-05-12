import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-custom-field vaadin-date-picker vaadin-number-field vaadin-text-field',
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
