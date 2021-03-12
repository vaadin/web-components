import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';

registerStyles(
  'vaadin-password-field',
  css`
    [part='reveal-button']::before {
      content: var(--lumo-icons-eye);
    }

    :host([password-visible]) [part='reveal-button']::before {
      content: var(--lumo-icons-eye-disabled);
    }

    /* Make it easy to hide the button across the whole app */
    [part='reveal-button'] {
      display: var(--lumo-password-field-reveal-button-display, block);
    }
  `,
  { moduleId: 'lumo-password-field' }
);
