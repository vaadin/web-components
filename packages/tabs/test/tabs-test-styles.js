import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: subset of Lumo needed for unit tests to pass.
// These should be eventually covered by base styles.
registerStyles(
  'vaadin-tabs',
  css`
    ::slotted(vaadin-tab) {
      display: flex;
      box-sizing: border-box;
      padding: 6px 8px;
      font-family: -apple-system, 'system-ui', Roboto, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      min-width: 55px; /* Use fixed width for scroll tests */
    }

    :host(:not([orientation='vertical'])) {
      position: relative;
      min-height: 2.75rem;
    }

    [part='tabs'] {
      gap: 0; /* Disable gap for scroll tests */
    }

    [part$='button'] {
      position: absolute;
      box-sizing: border-box;
      z-index: 1;
      height: 100%;
      padding: 6px 8px;
    }

    [part$='button']::after {
      width: 1lh;
      height: 1lh;
    }

    [part='forward-button'] {
      inset-inline-end: 0;
    }

    :host([orientation='vertical']) [part$='button'] {
      display: none;
    }
  `,
);
