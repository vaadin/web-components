import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import './vaadin-message-styles.js';

registerStyles(
  'vaadin-message-list',
  css`
    :host {
      padding: 8px;
    }
  `,
  { moduleId: 'material-message-list' }
);
