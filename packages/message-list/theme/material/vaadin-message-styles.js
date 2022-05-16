import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import './vaadin-message-avatar-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-message',
  css`
    :host {
      color: var(--material-body-text-color);
      font-family: var(--material-font-family);
      font-size: var(--material-body-font-size);
      line-height: 1.5;
      padding: 0.75rem 1rem;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
    }

    :host(:hover:not([disabled])) {
      background-color: var(--material-secondary-background-color);
    }

    :host([focused]:not([disabled])) {
      background-color: var(--material-divider-color);
    }

    @media (pointer: coarse) {
      :host(:hover:not([disabled])),
      :host([focused]:not([disabled])) {
        background-color: transparent;
      }
    }

    [part='header'] {
      min-height: calc(var(--material-body-font-size) * 1.5);
    }

    [part='name'] {
      margin-right: 0.5rem;
    }

    [part='name']:empty {
      margin-right: 0;
    }

    :host([dir='rtl']) [part='name'] {
      margin-left: 0.5rem;
      margin-right: 0;
    }

    :host([dir='rtl']) [part='name']:empty {
      margin-left: 0;
    }

    [part='time'] {
      color: var(--material-secondary-text-color);
      font-size: var(--material-small-font-size);
      line-height: 1.25rem;
    }
  `,
  { moduleId: 'material-message' },
);
