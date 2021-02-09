import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  '',
  css`
    [theme~='margin'] {
      margin: 16px;
    }

    [theme~='padding'] {
      padding: 16px;
    }
  `,
  { moduleId: 'material-ordered-layout' }
);
