import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-button/theme/material/vaadin-button-styles.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-area-styles.js';

registerStyles(
  'vaadin-message-input',
  css`
    :host {
      padding: 0.5em 1em;
    }

    vaadin-text-area {
      margin: 0 0.5em 0 0;
    }

    :host([dir='rtl']) vaadin-text-area {
      margin: 0 0 0 0.5em;
    }
  `,
  { moduleId: 'material-message-input' }
);
