import '@vaadin/vaadin-lumo-styles/spacing.js';
import { color } from '@vaadin/vaadin-lumo-styles/color.js';
import { typography } from '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const loginFormWrapper = css`
  :host {
    background: var(--lumo-base-color) linear-gradient(var(--lumo-tint-5pct), var(--lumo-tint-5pct));
    max-width: calc(var(--lumo-size-m) * 10);
  }

  [part='form'] {
    padding: var(--lumo-space-l);
  }

  [part='form-title'] {
    color: var(--lumo-header-text-color);
    font-size: var(--lumo-font-size-xxl);
    font-weight: 600;
    line-height: var(--lumo-line-height-xs);
    margin-top: calc(var(--lumo-font-size-xxxl) - var(--lumo-font-size-xxl));
  }

  ::slotted([slot='submit']) {
    margin-bottom: var(--lumo-space-s);
    margin-top: var(--lumo-space-l);
  }

  ::slotted([slot='forgot-password']) {
    margin: var(--lumo-space-s) auto;
  }

  [part='error-message'] {
    background-color: var(--lumo-error-color-10pct);
    border-radius: var(--lumo-border-radius-m);
    color: var(--lumo-error-text-color);
    margin-bottom: var(--lumo-space-s);
    margin-top: var(--lumo-space-m);
    padding: var(--lumo-space-m);
  }

  :host(:not([dir='rtl'])) [part='error-message'] {
    padding-left: var(--lumo-size-m);
  }

  :host([dir='rtl']) [part='error-message'] {
    padding-right: var(--lumo-size-m);
  }

  [part='error-message']::before {
    content: var(--lumo-icons-error);
    font-family: lumo-icons;
    font-size: var(--lumo-icon-size-m);
    height: 1em;
    line-height: 1;
    position: absolute;
    text-align: center;
    width: var(--lumo-size-m);
  }

  :host(:not([dir='rtl'])) [part='error-message']::before {
    /* Visual centering */
    margin-left: calc(var(--lumo-size-m) * -0.95);
  }

  :host([dir='rtl']) [part='error-message']::before {
    /* Visual centering */
    margin-right: calc(var(--lumo-size-m) * -0.95);
  }

  [part='error-message-title'] {
    color: inherit;
    display: block;
    line-height: var(--lumo-line-height-xs);
    margin: 0 0 0.25em;
  }

  [part='error-message-description'] {
    font-size: var(--lumo-font-size-s);
    line-height: var(--lumo-line-height-s);
    margin: 0;
    opacity: 0.9;
  }

  [part='footer'] {
    color: var(--lumo-secondary-text-color);
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-s);
  }
`;

registerStyles('vaadin-login-form-wrapper', [color, typography, loginFormWrapper], {
  moduleId: 'lumo-login-form-wrapper',
});
