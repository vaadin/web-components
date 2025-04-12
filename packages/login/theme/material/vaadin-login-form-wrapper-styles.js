import '@vaadin/vaadin-material-styles/color.js';
import { typography } from '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const loginFormWrapper = css`
  :host {
    background: var(--material-background-color) linear-gradient(hsla(0, 0%, 100%, 0.3), hsla(0, 0%, 100%, 0.3));
  }

  [part='form'] {
    display: flex;
    box-sizing: border-box;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding: 1.5rem;
  }

  [part='form-title'] {
    margin-top: calc(var(--material-h3-font-size) - var(--material-h4-font-size));
    font-size: var(--material-h5-font-size);
    font-weight: 300;
    letter-spacing: -0.01em;
    line-height: 1.1;
    text-indent: -0.07em;
  }

  ::slotted([slot='submit']) {
    flex-grow: 0;
    margin-top: 3em;
    margin-bottom: 2em;
  }

  @media only screen and (max-width: 1023px) {
    ::slotted([slot='submit']) {
      margin-top: 2.5em;
      margin-bottom: 1em;
    }
  }

  ::slotted([slot='forgot-password']) {
    padding-top: 12px;
    padding-bottom: 12px;
    margin: 0.5rem auto;
    text-transform: none;
  }

  [part='error-message'] {
    padding: 1rem;
    border-radius: 0.25em;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    background-color: hsla(3, 100%, 60%, 0.1);
    color: var(--material-error-text-color);
  }

  :host(:not([dir='rtl'])) [part='error-message'] {
    padding-left: 2.25rem;
  }

  :host([dir='rtl']) [part='error-message'] {
    padding-right: 2.25rem;
  }

  [part='error-message']::before {
    position: absolute;
    width: 2.25rem;
    height: 1em;
    content: '!';
    font-size: 1.3em;
    font-weight: 500;
    line-height: 1;
    text-align: center;
  }

  /* Visual centering */
  :host(:not([dir='rtl'])) [part='error-message']::before {
    margin-left: calc(2.25rem * -0.95);
  }

  :host([dir='rtl']) [part='error-message']::before {
    margin-right: calc(2.25rem * -0.95);
  }

  [part='error-message-title'] {
    display: block;
    margin: 0 0 0.25em;
    color: inherit;
    line-height: 1.1;
    text-indent: -0.025em;
  }

  [part='error-message'] p {
    margin: 0;
    font-size: var(--material-small-font-size);
    line-height: 1.375;
    opacity: 0.9;
  }

  [part='footer'] {
    color: var(--material-secondary-text-color);
    font-size: var(--material-small-font-size);
    line-height: 1.375;
  }
`;

registerStyles('vaadin-login-form-wrapper', [typography, loginFormWrapper], {
  moduleId: 'material-login-form-wrapper',
});
