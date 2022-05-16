import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* hide caret */
registerStyles(
  'vaadin-date-picker',
  css`
    :host([focus-ring]) ::slotted(input),
    :host([opened]) ::slotted(input) {
      caret-color: transparent;
    }
  `,
);

/* stop focused day animation */
registerStyles(
  'vaadin-month-calendar',
  css`
    [part='date'][focused]::before {
      animation: none !important;
    }
  `,
);
