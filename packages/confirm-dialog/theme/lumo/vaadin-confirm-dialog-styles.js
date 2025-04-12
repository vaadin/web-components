import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import { dialogOverlay } from '@vaadin/dialog/theme/lumo/vaadin-dialog-styles.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-confirm-dialog-overlay',
  [
    overlay,
    dialogOverlay,
    css`
      [part='header'] ::slotted(h3) {
        margin-bottom: 0 !important;
        margin-inline-start: calc(var(--lumo-space-l) - var(--lumo-space-m));
        margin-top: 0 !important;
      }

      [part='message'] {
        max-width: 100%;
        min-width: 100%;
        width: 25em;
      }

      ::slotted([slot$='button'][theme~='tertiary']) {
        padding-left: var(--lumo-space-s);
        padding-right: var(--lumo-space-s);
      }

      [part='cancel-button'] {
        flex-grow: 1;
      }

      @media (max-width: 360px) {
        [part='footer'] {
          align-items: stretch;
          flex-direction: column-reverse;
          gap: var(--lumo-space-s);
          padding: var(--lumo-space-s) var(--lumo-space-l);
        }

        ::slotted([slot$='button']) {
          margin: 0;
          width: 100%;
        }
      }
    `,
  ],
  { moduleId: 'lumo-confirm-dialog-overlay' },
);
