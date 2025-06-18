import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: subset of Lumo needed for unit tests to pass.
// These should be eventually covered by base styles.
registerStyles(
  'vaadin-tabs',
  css`
    ::slotted(vaadin-tab) {
      display: flex;
      box-sizing: border-box;
      padding: 0.5rem 0.75rem;
      font-family: -apple-system, 'system-ui', Roboto, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
    }

    ::slotted(vaadin-tab[orientation='vertical']) {
      padding: 0.25rem 1rem;
    }

    :host(:not([orientation='vertical'])) {
      position: relative;
      min-height: 2.75rem;
    }

    :host([orientation='horizontal']) [part='tabs'] {
      margin: 0 0.75rem;
    }

    [part='forward-button'],
    [part='back-button'] {
      position: absolute;
      z-index: 1;
      top: 0;
      font-size: 24px;
      width: 1.5em;
    }

    :host(:not([dir='rtl'])) [part='forward-button'] {
      right: 0;
    }

    :host([dir='rtl']) [part='forward-button'] {
      left: 0;
    }

    /* Used by "separator" element in scroll tests */
    :host(:not([dir='rtl'])) ::slotted(:not(vaadin-tab)) {
      margin-left: 1rem;
    }

    :host([dir='rtl']) ::slotted(:not(vaadin-tab)) {
      margin-right: 1rem;
    }
  `,
);
