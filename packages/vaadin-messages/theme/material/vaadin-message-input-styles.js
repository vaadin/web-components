import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/button/theme/material/vaadin-button.js';

registerStyles(
  'vaadin-message-input',
  css`
    :host {
      padding: 0.5em 1em;
    }
  `,
  { moduleId: 'material-message-input' }
);
