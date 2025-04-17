import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: subset of Lumo needed for unit tests to pass.
// These should be eventually covered by base styles.
registerStyles(
  'vaadin-grid',
  css`
    :host {
      --_lumo-grid-border-width: 0px;
    }

    [part~='cell'] {
      min-height: 2.25rem;
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      padding: 0.25rem 1rem;
    }

    [part~='row']:only-child [part~='header-cell'] {
      min-height: 3.5rem;
    }
  `,
);
