import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tabs',
  css`
    ::slotted(vaadin-tab) {
      box-sizing: border-box;
      font-family: -apple-system, 'system-ui', Roboto, 'Segoe UI', Helvetica, Arial, sans-serif;
      min-width: 55px; /* Use fixed width for scroll tests */
    }

    :host(:not([orientation='vertical'])) {
      min-height: 2.75rem;
    }

    [part='tabs'] {
      gap: 0; /* Disable gap for scroll tests */
    }
  `,
);
