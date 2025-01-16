import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-text-field',
  css`
    /* Hide caret */
    :host([focused]) ::slotted(input) {
      caret-color: transparent;
    }

    /* Show error message immediately */
    [part='error-message'] {
      animation: none !important;
      transition: none !important;
    }
  `,
);
