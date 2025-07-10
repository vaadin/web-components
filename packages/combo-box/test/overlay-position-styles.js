import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-combo-box-overlay',
  css`
    :host {
      inset: 16px;
    }

    [part='overlay'] {
      /* Reset overlay offset to simplify calculation */
      margin: 0 !important;
    }
  `,
);
