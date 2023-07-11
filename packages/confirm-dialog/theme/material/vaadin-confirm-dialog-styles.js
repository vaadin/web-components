import { dialogOverlay } from '@vaadin/dialog/theme/material/vaadin-dialog-styles.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-confirm-dialog-overlay',
  [
    overlay,
    dialogOverlay,
    css`
      [part='overlay'] {
        max-width: 100%;
        min-width: 0;
      }

      [part='content'] {
        min-width: 0;
      }

      [part='header'] ::slotted(h3) {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        margin-inline-start: 8px;
      }

      [part='message'] {
        width: 25em;
        max-width: 100%;
        margin-inline-end: 24px;
      }

      @media (max-width: 360px) {
        [part='footer'] {
          flex-direction: column-reverse;
          align-items: flex-end;
        }
      }
    `,
  ],
  { moduleId: 'material-confirm-dialog-overlay' },
);
