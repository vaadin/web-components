import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-confirm-dialog-overlay',
  css`
    [part='overlay'] {
      max-width: 100%;
      min-width: 0;
    }

    [part='content'] {
      padding: 8px 24px;
      min-width: 0;
      height: auto;
      box-sizing: content-box;
    }

    /* Apply height to the part inside the "content" part */
    [part='container'] {
      height: calc(var(--_vaadin-confirm-dialog-content-height) - var(--_vaadin-confirm-dialog-footer-height) - 39px);
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

    /* LTR styles */
    :host(:not([dir='rtl'])) ::slotted([slot$='button']:not([slot^='confirm'])) {
      margin-right: 8px;
    }

    /* RTL styles */
    :host([dir='rtl']) [part='message'] {
      margin-left: 24px;
      margin-right: 0;
    }

    :host([dir='rtl']) [part='footer'] {
      margin-left: -16px;
      margin-right: 0;
    }

    :host([dir='rtl']) ::slotted([slot$='button']:not([slot^='confirm'])) {
      margin-left: 8px;
    }

    @media (max-width: 360px) {
      [part='footer'] {
        flex-direction: column-reverse;
        align-items: flex-end;
      }

      ::slotted([slot$='button']:not([slot^='confirm'])) {
        margin-top: 8px;
      }

      :host(:not([dir='rtl'])) ::slotted([slot$='button']:not([slot^='confirm'])) {
        margin-right: 0;
      }

      :host([dir='rtl']) ::slotted([slot$='button']:not([slot^='confirm'])) {
        margin-left: 0;
      }
    }
  `,
  { moduleId: 'material-confirm-dialog-overlay' }
);
