import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-styles.js';

registerStyles(
  'vaadin-grid-pro',
  css`
    :host([navigating]) [part~='cell']:active {
      box-shadow: inset 0 0 0 2px var(--material-primary-color);
    }
  `,
  { moduleId: 'material-grid-pro' }
);
