import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* hide caret */
registerStyles(
  'vaadin-time-picker',
  css`
    :host([focus-ring]) ::slotted(input),
    :host([opened]) ::slotted(input) {
      caret-color: transparent;
    }
  `,
);
