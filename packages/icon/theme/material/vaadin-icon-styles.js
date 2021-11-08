import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-icon',
  css`
    :host {
      width: 24px;
      height: 24px;
    }
  `,
  { moduleId: 'material-icon' }
);
