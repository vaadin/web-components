import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-confirm-dialog-overlay',
  css`
    [part='header'] ::slotted(h3) {
      margin-top: 0 !important;
    }

    [part='message'] {
      width: 25em;
      min-width: 100%;
      max-width: 100%;
    }

    [part='footer'] {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      margin: calc(var(--lumo-space-l) * -1);
      margin-top: var(--lumo-space-l);
      padding: 0 var(--lumo-space-l);
      background-color: var(--lumo-contrast-5pct);
      border-bottom-left-radius: var(--lumo-border-radius-l);
      border-bottom-right-radius: var(--lumo-border-radius-l);
    }

    [part='footer'] > * {
      margin-top: var(--lumo-space-s);
      margin-bottom: var(--lumo-space-s);
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
        flex-direction: column-reverse;
      }

      [part='footer'] div {
        margin: var(--lumo-space-xs) calc(var(--lumo-space-l) / -2) calc(var(--lumo-space-xs) * -1);
      }

      ::slotted([slot$='button']) {
        width: 100%;
        margin-top: var(--lumo-space-xs);
        margin-bottom: var(--lumo-space-xs);
      }

      [part='confirm-button'] {
        margin-top: var(--lumo-space-s);
      }

      [part='cancel-button'] {
        margin-bottom: var(--lumo-space-s);
      }
    }

    /* LTR styles */
    :host(:not([dir='rtl'])) [part='cancel-button'] {
      margin-left: calc(var(--lumo-space-s) * -1);
    }

    :host(:not([dir='rtl'])) [part='confirm-button'] {
      margin-right: calc(var(--lumo-space-s) * -1);
      margin-left: var(--lumo-space-s);
    }

    :host(:not([dir='rtl'])) [part='reject-button'] {
      margin-left: var(--lumo-space-s);
    }

    /* RTL styles */
    :host([dir='rtl']) [part='cancel-button'] {
      margin-right: calc(var(--lumo-space-s) * -1);
    }

    :host([dir='rtl']) [part='confirm-button'] {
      margin-right: var(--lumo-space-s);
      margin-left: calc(var(--lumo-space-s) * -1);
    }

    :host([dir='rtl']) [part='reject-button'] {
      margin-right: var(--lumo-space-s);
    }
  `,
  { moduleId: 'lumo-confirm-dialog-overlay' }
);
