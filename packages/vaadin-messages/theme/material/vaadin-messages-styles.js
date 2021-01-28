import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';

registerStyles(
  'vaadin-messages',
  css`
    :host {
      margin: 8px 0;
      height: 32px;
    }

    [part='value'] {
      color: black;
    }

    /* RTL specific styles */
    :host([dir='rtl']) [part='value'] {
      transform-origin: 100% 0;
    }
  `,
  { moduleId: 'material-messages' }
);
