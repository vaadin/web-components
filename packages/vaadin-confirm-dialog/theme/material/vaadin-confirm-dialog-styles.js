import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-dialog-overlay',
  css`
    :host([theme~='_vaadin-confirm-dialog-dialog-overlay-theme']) [part='overlay'] {
      max-width: 100%;
      min-width: 0;
    }

    :host([theme~='_vaadin-confirm-dialog-dialog-overlay-theme']) [part='content'] {
      padding: 8px 24px;
      min-width: 0;
      height: auto;
      box-sizing: content-box;
    }
  `,
  { moduleId: 'material-confirm-dialog-overlay' }
);

registerStyles(
  'vaadin-confirm-dialog',
  css`
    #content {
      height: calc(var(--_vaadin-confirm-dialog-content-height) - var(--_vaadin-confirm-dialog-footer-height) - 39px);
      width: var(--_vaadin-confirm-dialog-content-width);
    }

    [part='message'] {
      width: 25em;
      max-width: 100%;
      margin-right: 24px;
    }

    [part='footer'] {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      margin-top: 28px;
      margin-right: -16px;
    }

    [part='footer']:not([dir='rtl']) div:nth-child(-n + 2) vaadin-button,
    [part='footer']:not([dir='rtl']) div:nth-child(-n + 2) ::slotted(*) {
      margin-right: 8px;
    }

    @media (max-width: 360px) {
      [part='footer'] {
        flex-direction: column-reverse;
        align-items: flex-end;
      }

      [part='footer'] div:nth-child(-n + 2) vaadin-button,
      [part='footer'] div:nth-child(-n + 2) ::slotted(*) {
        margin-top: 8px;
        margin-right: 0;
      }

      [part='footer'] div:nth-last-child(1) vaadin-button,
      [part='footer'] div:nth-last-child(1) ::slotted(*) {
        margin-top: 8px;
      }

      /* RTL specific styles */
      [part='footer'][dir='rtl'] div:nth-child(-n + 2) vaadin-button,
      [part='footer'][dir='rtl'] div:nth-child(-n + 2) ::slotted(*) {
        margin-left: 0;
      }
    }

    /* RTL specific styles */
    [dir='rtl'] > [part='message'] {
      margin-left: 24px;
      margin-right: 0;
    }

    [part='footer'][dir='rtl'] {
      margin-left: -16px;
      margin-right: 0;
    }

    [part='footer'][dir='rtl'] div:nth-child(-n + 2) vaadin-button,
    [part='footer'][dir='rtl'] div:nth-child(-n + 2) ::slotted(*) {
      margin-left: 8px;
    }
  `,
  { moduleId: 'material-confirm-dialog' }
);
