import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/user-colors.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const globalStyle = document.createElement('style');
globalStyle.textContent = 'html { --vaadin-avatar-size: var(--lumo-size-m); }';
document.head.appendChild(globalStyle);

registerStyles(
  'vaadin-avatar',
  css`
    :host {
      color: var(--lumo-secondary-text-color);
      background-color: var(--lumo-contrast-10pct);
      border-radius: 50%;
      outline: none;
      cursor: default;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([has-color-index]) {
      color: var(--lumo-base-color);
    }

    :host([focus-ring]) {
      border-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    }

    [part='icon']::before {
      display: block;
      content: var(--lumo-icons-user);
      font-family: lumo-icons;
    }

    [part='abbr'] {
      font-family: var(--lumo-font-family);
      font-weight: 500;
    }

    :host([theme~='xlarge']) {
      --vaadin-avatar-size: var(--lumo-size-xl);
    }

    :host([theme~='large']) {
      --vaadin-avatar-size: var(--lumo-size-l);
    }

    :host([theme~='small']) {
      --vaadin-avatar-size: var(--lumo-size-s);
    }

    :host([theme~='xsmall']) {
      --vaadin-avatar-size: var(--lumo-size-xs);
    }
  `,
  { moduleId: 'lumo-avatar' },
);
