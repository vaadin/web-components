import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-login-form-wrapper',
  css`
    :host([theme='green']) [part='form-title'],
    :host([theme='green']) [part='error-message-title'],
    :host([theme='green']) [part='error-message-description'] {
      color: rgb(0, 128, 0);
    }
  `,
);
