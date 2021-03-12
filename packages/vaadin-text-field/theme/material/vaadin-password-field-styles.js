import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';

registerStyles(
  'vaadin-password-field',
  css`
    [part='reveal-button']::before {
      content: var(--material-icons-eye);
    }

    :host([password-visible]) [part='reveal-button']::before {
      content: var(--material-icons-eye-disabled);
    }

    /* The reveal button works also in readonly  mode */
    :host([readonly]) [part\$='button'] {
      color: var(--material-secondary-text-color);
    }

    [part='reveal-button'] {
      cursor: pointer;
    }

    [part='reveal-button']:hover {
      color: var(--material-text-color);
    }
  `,
  { moduleId: 'material-password-field' }
);
