import '@vaadin/vaadin-material-styles/color.js';
import { typography } from '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const loginFormWrapper = css`
  :host {
    background: var(--material-background-color) linear-gradient(hsla(0, 0%, 100%, 0.3), hsla(0, 0%, 100%, 0.3));
  }

  [part='form'] {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: center;
  }

  [part='form-title'] {
    margin-top: calc(var(--material-h3-font-size) - var(--material-h4-font-size));
    font-size: var(--material-h5-font-size);
  }

  ::slotted([slot='submit']) {
    margin-top: 3em;
    margin-bottom: 2em;
    flex-grow: 0;
  }

  @media only screen and (max-width: 1023px) {
    ::slotted([slot='submit']) {
      margin-top: 2.5em;
      margin-bottom: 1em;
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
    padding: 1rem;
    border-radius: 0.25em;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: var(--material-error-text-color);
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
    position: absolute;
    width: 2.25rem;
    height: 1em;
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

  [part='error-message'] h5 {
    margin: 0 0 0.25em;
    color: inherit;
  }

  [part='error-message'] p {
    font-size: var(--material-small-font-size);
    line-height: 1.375;
    margin: 0;
    opacity: 0.9;
  }

  [part='footer'] {
    font-size: var(--material-small-font-size);
    line-height: 1.375;
    color: var(--material-secondary-text-color);
  }
`;

registerStyles('vaadin-login-form-wrapper', [typography, loginFormWrapper], {
  moduleId: 'material-login-form-wrapper',
});
