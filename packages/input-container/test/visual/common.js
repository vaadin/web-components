import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-input-container',
  css`
    /* Disable animation */
    :host {
      &,
      &::before,
      &::after {
        animation: none !important;
        transition: none !important;
      }
    }

    /* Hide caret */
    ::slotted(input) {
      caret-color: transparent;
    }
  `,
);
