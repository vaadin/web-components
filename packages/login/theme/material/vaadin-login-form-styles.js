import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-login-form',
  css`
    vaadin-button[part='vaadin-login-submit'] {
      margin-top: 3em;
      margin-bottom: 2em;
      flex-grow: 0;
    }

    /* Small screen */
    @media only screen and (max-width: 1023px) {
      vaadin-button[part='vaadin-login-submit'] {
        margin-top: 2.5em;
        margin-bottom: 1em;
      }
    }
  `,
  { moduleId: 'material-login-form' }
);
