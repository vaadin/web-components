import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: subset of Lumo needed for unit tests to pass.
// These should be eventually covered by base styles.
registerStyles(
  'vaadin-multi-select-combo-box',
  css`
    ::slotted([slot='chip']),
    ::slotted([slot='overflow']) {
      padding: 0 0.5625em;
    }

    ::slotted([slot='chip']:not(:last-of-type)),
    ::slotted([slot='overflow']:not(:last-of-type)) {
      margin-inline-end: 0.25rem;
    }

    ::slotted([slot='chip']:not([readonly]):not([disabled])) {
      padding-inline-end: 0;
    }

    [part='toggle-button'] {
      color: var(--_vaadin-color-subtle);
    }

    [part='toggle-button']::before {
      background: currentColor;
      content: '';
      display: block;
      height: var(--vaadin-icon-size, 1lh);
      mask-image: var(--_vaadin-icon-chevron-down);
      width: var(--vaadin-icon-size, 1lh);
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
      color: var(--_vaadin-color-subtle);
      font-size: 1.5em;
    }

    [part='remove-button']::before {
      background: currentColor;
      content: '';
      display: block;
      height: var(--vaadin-icon-size, 1lh);
      mask-image: var(--_vaadin-icon-cross);
      width: var(--vaadin-icon-size, 1lh);
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
