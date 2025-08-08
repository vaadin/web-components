import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// TODO: subset of base styles needed for unit tests to pass.
// Should be eventually removed after switching to use base styles.
registerStyles(
  'vaadin-multi-select-combo-box',
  css`
    [part$='button'] {
      line-height: 1.25;
    }
  `,
);

registerStyles(
  'vaadin-multi-select-combo-box-chip',
  css`
    :host {
      font-family: -apple-system, 'system-ui', Roboto, 'Segoe UI', Helvetica, Arial, sans-serif;
    }
  `,
);
