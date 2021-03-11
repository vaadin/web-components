import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-area-styles.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field-styles.js';

registerStyles(
  'vaadin-message-input-text-area',
  css`
    :host {
      margin: 0 0.5em 0 0;
    }

    :host([dir='rtl']) {
      margin: 0 0 0 0.5em;
    }
  `,
  { moduleId: 'material-message-input-text-area' }
);
