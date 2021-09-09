import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import './vaadin-message-styles.js';

registerStyles(
  'vaadin-message-list',
  css`
    [part='list'] {
      padding: 8px 0;
    }
  `,
  { moduleId: 'material-message-list' }
);
