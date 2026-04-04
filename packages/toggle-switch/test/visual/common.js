import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-toggle-switch',
  css`
    [part='label'],
    [part='switch'],
    [part='thumb'],
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
