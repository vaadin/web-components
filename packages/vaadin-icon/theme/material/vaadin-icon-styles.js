import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-icon',
  css`
    :host {
      width: 18px;
      height: 18px;
    }
  `,
  { moduleId: 'material-icon' }
);
