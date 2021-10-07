import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-context-menu-overlay',
  css`
    :host(:first-of-type) {
      padding-top: 5px;
    }
  `,
  { moduleId: 'material-menu-bar-overlay' }
);
