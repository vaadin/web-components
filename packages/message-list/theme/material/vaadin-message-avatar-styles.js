import '@vaadin/avatar/theme/material/vaadin-avatar-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-message-avatar',
  css`
    :host {
      --vaadin-avatar-size: 2.5rem;
      margin-right: calc(1rem - var(--vaadin-avatar-outline-width));
      margin-top: calc(0.25rem - var(--vaadin-avatar-outline-width));
    }

    :host([dir='rtl']) {
      margin-left: calc(1em - var(--vaadin-avatar-outline-width));
      margin-right: calc(var(--vaadin-avatar-outline-width) * -1);
    }
  `,
  { moduleId: 'material-message-avatar' }
);
