import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: subset of Lumo needed for unit tests to pass.
// These should be eventually covered by base styles.
registerStyles(
  'vaadin-item',
  css`
    :host {
      display: flex;
    }
  `,
);
