import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/user-colors.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const globalStyle = document.createElement('style');
globalStyle.textContent = 'html { --vaadin-avatar-size: var(--lumo-size-m); }';
document.head.appendChild(globalStyle);

registerStyles(
  'vaadin-avatar',
  css`
    @layer base {
      :host {
        vertical-align: revert-layer;
        background-image: none;
        background-color: var(--lumo-contrast-10pct);
      }

      :host([focus-ring]) {
        outline: none;
      }

      [part='icon'] {
        mask-image: revert-layer;
        background: revert-layer;
        margin: revert-layer;
      }

      [part='icon'] > text {
        display: revert-layer;
      }
    }

    :host {
      color: var(--lumo-secondary-text-color);
      outline: none;
      cursor: default;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([has-color-index]) {
      color: var(--lumo-base-color);
    }

    :host([focus-ring]) {
      border-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    }

    [part='icon'],
    [part='abbr'] {
      fill: currentColor;
    }

    [part='icon'] > text {
      font-family: 'vaadin-avatar-icons';
    }

    [part='abbr'] {
      font-family: var(--lumo-font-family);
      font-size: 2.4375em;
      font-weight: 500;
    }

    :host([theme~='xlarge']) [part='abbr'] {
      font-size: 2.5em;
    }

    :host([theme~='large']) [part='abbr'] {
      font-size: 2.375em;
    }

    :host([theme~='small']) [part='abbr'] {
      font-size: 2.75em;
    }

    :host([theme~='xsmall']) [part='abbr'] {
      font-size: 3em;
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
