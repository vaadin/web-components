import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-combo-box',
  css`
    /* Hide caret */
    :host([focused]) ::slotted(input),
    :host([opened]) ::slotted(input) {
      caret-color: transparent;
    }

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

/* Stop loader animation */
registerStyles(
  'vaadin-combo-box-overlay',
  css`
    :host([loading]) [part='loader'] {
      animation: none;
      opacity: 1;
    }
  `,
);
