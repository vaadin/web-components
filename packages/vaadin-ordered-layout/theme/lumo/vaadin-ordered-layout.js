import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';

registerStyles(
  '',
  css`
    :host([theme~='margin']) {
      margin: var(--lumo-space-m);
    }

    :host([theme~='padding']) {
      padding: var(--lumo-space-m);
    }
  `,
  { moduleId: 'lumo-ordered-layout' }
);
