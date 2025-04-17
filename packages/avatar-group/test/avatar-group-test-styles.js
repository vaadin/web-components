import { addGlobalThemeStyles, css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-avatar-group',
  css`
    :host {
      --vaadin-avatar-size: 2.25rem;
    }
  `,
);

addGlobalThemeStyles(
  '',
  css`
    :host {
      --vaadin-user-color-0: #000;
      --vaadin-user-color-1: #000;
      --vaadin-user-color-2: #000;
    }
  `,
);
