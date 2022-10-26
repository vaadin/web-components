import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Hide caret */
registerStyles(
  'vaadin-date-picker',
  css`
    :host([focus-ring]) ::slotted(input),
    :host([opened]) ::slotted(input) {
      caret-color: transparent;
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
