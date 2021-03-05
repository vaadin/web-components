import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-avatar/theme/material/vaadin-avatar-styles.js';

registerStyles(
  'vaadin-message',
  css`
    :host {
      font-family: var(--material-font-family);
      font-size: var(--material-body-font-size);
      line-height: 1.5;
      padding: 0.75rem 1rem;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
    }

    vaadin-avatar {
      --vaadin-avatar-size: 2.5rem;
      margin-right: calc(1rem - var(--vaadin-avatar-outline-width));
      margin-top: calc(0.25rem - var(--vaadin-avatar-outline-width));
    }

    :host([dir='rtl']) vaadin-avatar {
      margin-left: calc(1em - var(--vaadin-avatar-outline-width));
      margin-right: calc(var(--vaadin-avatar-outline-width) * -1);
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
  { moduleId: 'material-message' }
);
