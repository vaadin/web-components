import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-multi-select-combo-box',
  css`
    /* Hide caret */
    :host([focused]:not([has-value])) ::slotted(input),
    :host([focused][has-value]) ::slotted(input) {
      caret-color: transparent !important;
    }

    /* Show error message immediately */
    [part='error-message'] {
      animation: none !important;
      transition: none !important;
    }
  `,
);
