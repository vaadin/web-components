import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Hide caret */
registerStyles(
  'vaadin-multi-select-combo-box',
  css`
    :host([focus-ring]) ::slotted(input),
    :host([opened]) ::slotted(input) {
      caret-color: transparent;
    }
  `,
);
