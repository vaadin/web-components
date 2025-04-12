import '@vaadin/vaadin-material-styles/color.js';
import { typography } from '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const loginFormWrapper = css`
  :host {
    background: var(--material-background-color) linear-gradient(hsla(0, 0%, 100%, 0.3), hsla(0, 0%, 100%, 0.3));
  }

  [part='form'] {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding: 1.5rem;
  }

  [part='form-title'] {
    font-size: var(--material-h5-font-size);
    font-weight: 300;
    letter-spacing: -0.01em;
    line-height: 1.1;
    margin-top: calc(var(--material-h3-font-size) - var(--material-h4-font-size));
    text-indent: -0.07em;
  }

  ::slotted([slot='submit']) {
    flex-grow: 0;
    margin-bottom: 2em;
    margin-top: 3em;
  }

  @media only screen and (max-width: 1023px) {
    ::slotted([slot='submit']) {
      margin-bottom: 1em;
      margin-top: 2.5em;
    }
  }

  ::slotted([slot='forgot-password']) {
    margin: 0.5rem auto;
    padding-bottom: 12px;
    padding-top: 12px;
    text-transform: none;
  }

  [part='error-message'] {
    background-color: hsla(3, 100%, 60%, 0.1);
    border-radius: 0.25em;
    color: var(--material-error-text-color);
    margin-bottom: 0.5rem;
    margin-top: 1rem;
    padding: 1rem;
  }

  :host(:not([dir='rtl'])) [part='error-message'] {
    padding-left: 2.25rem;
  }

  :host([dir='rtl']) [part='error-message'] {
    padding-right: 2.25rem;
  }

  [part='error-message']::before {
    content: '!';
    font-size: 1.3em;
    font-weight: 500;
    height: 1em;
    line-height: 1;
    position: absolute;
    text-align: center;
    width: 2.25rem;
  }

  /* Visual centering */
  :host(:not([dir='rtl'])) [part='error-message']::before {
    margin-left: calc(2.25rem * -0.95);
  }

  :host([dir='rtl']) [part='error-message']::before {
    margin-right: calc(2.25rem * -0.95);
  }

  [part='error-message-title'] {
    color: inherit;
    display: block;
    line-height: 1.1;
    margin: 0 0 0.25em;
    text-indent: -0.025em;
  }

  [part='error-message'] p {
    font-size: var(--material-small-font-size);
    line-height: 1.375;
    margin: 0;
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
