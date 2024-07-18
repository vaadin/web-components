import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Hide caret */
registerStyles(
  'vaadin-combo-box',
  css`
    :host([focus-ring]) ::slotted(input),
    :host([opened]) ::slotted(input) {
      caret-color: transparent;
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
