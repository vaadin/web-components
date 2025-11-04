import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-dialog-overlay',
  css`
    :host {
      inset: 0;
    }

    /* Disable optical centering */
    :host::after {
      flex-grow: 1;
    }

    /* Disable default border */
    [part='overlay'] {
      border: none;
    }

    /* Disable content padding */
    [part='content'] {
      padding: 0;
    }
  `,
);
