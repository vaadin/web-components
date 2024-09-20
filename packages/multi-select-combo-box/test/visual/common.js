import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-multi-select-combo-box',
  css`
    /* Hide caret */
    :host([focused][focus-ring]) ::slotted(input),
    :host([focused][has-value]) ::slotted(input),
    :host([focused][opened]) ::slotted(input) {
      caret-color: transparent !important;
    }

    /* Show error message immediately */
    [part='error-message'] {
      transition: none !important;
    }
  `,
);
