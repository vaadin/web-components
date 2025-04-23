import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: subset of Lumo needed for unit tests to pass.
// These should be eventually covered by base styles.
registerStyles(
  'vaadin-multi-select-combo-box',
  css`
    ::slotted([slot='chip']),
    ::slotted([slot='overflow']) {
      padding: 0.3125em 0.5625em;
    }

    ::slotted([slot='chip']:not(:last-of-type)),
    ::slotted([slot='overflow']:not(:last-of-type)) {
      margin-inline-end: 0.25rem;
    }

    ::slotted([slot='chip']:not([readonly]):not([disabled])) {
      padding-inline-end: 0;
    }

    ::slotted(input) {
      padding: 0 0.25em;
    }

    [part$='button'] {
      flex: none;
      font-size: 1.5em;
      width: 1em;
      height: 1em;
    }

    [part$='button']::before {
      display: block;
      height: 100%;
    }
  `,
);

registerStyles(
  'vaadin-multi-select-combo-box-container',
  css`
    :host {
      padding: 0 6px;
    }
  `,
);

registerStyles(
  'vaadin-multi-select-combo-box-chip',
  css`
    :host {
      font-family: -apple-system, 'system-ui', Roboto, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 0.75rem;
    }

    [part='label'] {
      font-weight: 500;
    }

    [part='remove-button'] {
      display: flex;
      width: 1.25em;
      height: 1.25em;
      font-size: 1.5em;
    }
  `,
);

registerStyles(
  'vaadin-multi-select-combo-box-item',
  css`
    :host {
      min-height: 2.25rem;
    }
  `,
);
