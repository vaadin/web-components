import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: subset of base styles needed for unit tests to pass.
// Should be eventually removed after switching to use base styles.
registerStyles(
  'vaadin-multi-select-combo-box',
  css`
    :host {
      --_chip-min-width: 48px;
      --_wrapper-gap: 2px;
    }

    #chips {
      gap: 2px;
    }

    ::slotted([slot='chip']),
    ::slotted([slot='overflow']) {
      padding: 0 0.3em;
    }

    [part$='button'] {
      flex: none;
      line-height: 1.25;
    }

    [part$='button']::before {
      display: block;
      content: '';
      height: 1lh;
      width: 1lh;
    }
  `,
);

registerStyles(
  'vaadin-multi-select-combo-box-container',
  css`
    :host {
      padding: 6px 8px;
      gap: 0.5em;
    }
  `,
);

registerStyles(
  'vaadin-multi-select-combo-box-chip',
  css`
    :host {
      font-family: -apple-system, 'system-ui', Roboto, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 0.875rem;
      border: solid 1px;
      gap: 0.3em;
    }

    :host([slot='overflow']) {
      min-width: 1.5em;
    }

    :host(:not([slot='overflow'])) {
      min-width: min(max-content, var(--vaadin-chip-min-width, 48px));
    }

    [part='label'] {
      font-weight: 500;
    }

    [part='remove-button'] {
      display: flex;
      flex: 0 0 auto;
      line-height: 1.25;
    }

    [part='remove-button']::before {
      content: '';
      display: block;
      width: 1lh;
      height: 1lh;
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
