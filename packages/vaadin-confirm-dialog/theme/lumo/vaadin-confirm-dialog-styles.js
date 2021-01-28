import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';

registerStyles(
  'vaadin-dialog-overlay',
  css`
    :host([theme~='_vaadin-confirm-dialog-dialog-overlay-theme']) [part='content'] {
      height: auto;
      box-sizing: content-box;
    }
  `,
  { moduleId: 'lumo-confirm-dialog-overlay' }
);

registerStyles(
  'vaadin-confirm-dialog',
  css`
    #content {
      height: calc(
        var(--_vaadin-confirm-dialog-content-height) - var(--_vaadin-confirm-dialog-footer-height) - var(--lumo-space-s)
      );
      width: var(--_vaadin-confirm-dialog-content-width);
    }

    [part='header'],
    .header {
      margin-top: var(--lumo-space-s);
      margin-bottom: var(--lumo-space-m);
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
    }

    [part='footer'] div {
      margin-top: var(--lumo-space-s);
      margin-bottom: var(--lumo-space-s);
    }

    vaadin-button[theme~='tertiary'] {
      padding-left: var(--lumo-space-s);
      padding-right: var(--lumo-space-s);
    }

    .cancel-button {
      flex-grow: 1;
    }

    :not([dir='rtl']) > .cancel-button {
      margin-left: calc(var(--lumo-space-s) * -1);
    }

    :not([dir='rtl']) > .confirm-button {
      margin-right: calc(var(--lumo-space-s) * -1);
    }

    :not([dir='rtl']) > .reject-button,
    :not([dir='rtl']) > .confirm-button {
      margin-left: var(--lumo-space-s);
    }

    @media (max-width: 360px) {
      [part='footer'] {
        flex-direction: column-reverse;
      }

      [part='footer'] div {
        margin: var(--lumo-space-xs) calc(var(--lumo-space-l) / -2) calc(var(--lumo-space-xs) * -1);
      }

      [part='footer'] vaadin-button,
      [part='footer'] ::slotted(*) {
        width: 100%;
        margin-top: var(--lumo-space-xs);
        margin-bottom: var(--lumo-space-xs);
      }

      [part='footer'] .confirm-button {
        margin-top: var(--lumo-space-s);
      }

      [part='footer'] .cancel-button {
        margin-bottom: var(--lumo-space-s);
      }
    }

    /* RTL specific styles */
    [dir='rtl'] > .cancel-button {
      margin-right: calc(var(--lumo-space-s) * -1);
    }

    [dir='rtl'] > .confirm-button {
      margin-left: calc(var(--lumo-space-s) * -1);
    }

    [dir='rtl'] > .reject-button,
    [dir='rtl'] > .confirm-button {
      margin-right: var(--lumo-space-s);
    }
  `,
  { moduleId: 'lumo-confirm-dialog' }
);
