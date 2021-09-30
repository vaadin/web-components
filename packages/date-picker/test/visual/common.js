import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

/* hide caret */
registerStyles(
  'vaadin-date-picker',
  css`
    :host([focus-ring]) ::slotted(input),
    :host([opened]) ::slotted(input) {
      font-size: 0 !important;
    }
  `
);

/* stop focused day animation */
registerStyles(
  'vaadin-month-calendar',
  css`
    [part='date'][focused]::before {
      animation: none;
    }
  `
);
