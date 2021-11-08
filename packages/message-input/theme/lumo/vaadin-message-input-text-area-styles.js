import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-message-input-text-area',
  css`
    :host {
      margin: 0 var(--lumo-space-s) 0 0;
    }

    :host([dir='rtl']) {
      margin: 0 0 0 var(--lumo-space-s);
    }
  `,
  { moduleId: 'lumo-message-input-text-area' }
);
