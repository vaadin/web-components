import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Hide caret */
registerStyles(
  'vaadin-multi-select-combo-box',
  css`
    :host([focused][focus-ring]) ::slotted(input),
    :host([focused][opened]) ::slotted(input) {
      caret-color: transparent !important;
    }
  `,
);
