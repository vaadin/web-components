import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-menu-bar',
  css`
    [part='container'] {
      /* To retain the box-shadow */
      padding-bottom: 5px;
    }
  `,
  { moduleId: 'material-menu-bar' }
);
