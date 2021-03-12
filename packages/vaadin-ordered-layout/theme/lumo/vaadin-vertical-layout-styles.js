import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import './vaadin-ordered-layout.js';

registerStyles(
  'vaadin-vertical-layout',
  css`
    :host([theme~='spacing-xs']) ::slotted(*) {
      margin-top: var(--lumo-space-xs);
    }

    :host([theme~='spacing-s']) ::slotted(*) {
      margin-top: var(--lumo-space-s);
    }

    :host([theme~='spacing']) ::slotted(*) {
      margin-top: var(--lumo-space-m);
    }

    :host([theme~='spacing-l']) ::slotted(*) {
      margin-top: var(--lumo-space-l);
    }

    :host([theme~='spacing-xl']) ::slotted(*) {
      margin-top: var(--lumo-space-xl);
    }

    /* Compensate for the first item margin, so that there is no gap around the layout itself. */
    :host([theme~='spacing-xs'])::before {
      content: '';
      margin-top: calc(var(--lumo-space-xs) * -1);
    }

    :host([theme~='spacing-s'])::before {
      content: '';
      margin-top: calc(var(--lumo-space-s) * -1);
    }

    :host([theme~='spacing'])::before {
      content: '';
      margin-top: calc(var(--lumo-space-m) * -1);
    }

    :host([theme~='spacing-l'])::before {
      content: '';
      margin-top: calc(var(--lumo-space-l) * -1);
    }

    :host([theme~='spacing-xl'])::before {
      content: '';
      margin-top: calc(var(--lumo-space-xl) * -1);
    }
  `,
  { include: ['lumo-ordered-layout'], moduleId: 'lumo-vertical-layout' }
);
