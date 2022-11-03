import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-login-form',
  css`
    form > vaadin-button[theme~='submit'] {
      margin-top: 3em;
      margin-bottom: 2em;
      flex-grow: 0;
    }

    /* Small screen */
    @media only screen and (max-width: 1023px) {
      form > vaadin-button[theme~='submit'] {
        margin-top: 2.5em;
        margin-bottom: 1em;
      }
    }
  `,
  { moduleId: 'material-login-form' },
);
