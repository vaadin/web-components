import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: this should be eventually covered by base styles
registerStyles(
  'vaadin-dialog-overlay',
  css`
    [part='content'] {
      padding: 1.5rem;
    }
  `,
);
