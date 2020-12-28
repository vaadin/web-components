import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';

registerStyles(
  'vaadin-login-form',
  css`
    vaadin-button[part='vaadin-login-submit'] {
      margin-top: var(--lumo-space-l);
      margin-bottom: var(--lumo-space-s);
    }
  `,
  { moduleId: 'lumo-login-form' }
);
