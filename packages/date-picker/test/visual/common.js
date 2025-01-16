import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-date-picker',
  css`
    /* Hide caret */
    :host([focused]) ::slotted(input),
    :host([opened]) ::slotted(input) {
      caret-color: transparent;
    }

    /* Show error message immediately */
    [part='error-message'] {
      animation: none !important;
      transition: none !important;
    }
  `,
);

/* Stop focused day animation */
registerStyles(
  'vaadin-month-calendar',
  css`
    [part~='focused']::before {
      animation: none !important;
    }
  `,
);
