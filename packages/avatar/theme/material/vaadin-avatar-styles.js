import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-material-styles/user-colors.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const globalStyle = document.createElement('style');
globalStyle.textContent = 'html { --vaadin-avatar-size: 2.25rem; }';
document.head.appendChild(globalStyle);

registerStyles(
  'vaadin-avatar',
  css`
    :host {
      border-radius: 50%;
      background-color: var(--material-secondary-background-color);
      color: var(--material-secondary-text-color);
      cursor: default;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      outline: none;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }

    :host([has-color-index]) {
      color: var(--material-primary-contrast-color);
    }

    :host([focus-ring]) {
      border-color: var(--material-primary-color);
    }

    [part='icon'],
    [part='abbr'] {
      fill: currentColor;
    }

    [part='abbr'] {
      font-family: var(--material-font-family);
      font-size: 3em;
      font-weight: 500;
    }

    :host([theme~='xlarge']) {
      --vaadin-avatar-size: 3.5rem;
    }

    :host([theme~='large']) {
      --vaadin-avatar-size: 2.75rem;
    }

    :host([theme~='small']) {
      --vaadin-avatar-size: 1.875rem;
    }

    :host([theme~='xsmall']) {
      --vaadin-avatar-size: 1.625rem;
    }
  `,
  { moduleId: 'material-avatar' },
);
