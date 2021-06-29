import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import './vaadin-ordered-layout.js';

registerStyles(
  'vaadin-vertical-layout',
  css`
    :host([theme~='spacing-xs']) ::slotted(*:not(:first-child)) {
      margin-top: var(--lumo-space-xs);
    }

    :host([theme~='spacing-s']) ::slotted(*:not(:first-child)) {
      margin-top: var(--lumo-space-s);
    }

    :host([theme~='spacing']) ::slotted(*:not(:first-child)) {
      margin-top: var(--lumo-space-m);
    }

    :host([theme~='spacing-l']) ::slotted(*:not(:first-child)) {
      margin-top: var(--lumo-space-l);
    }

    :host([theme~='spacing-xl']) ::slotted(*:not(:first-child)) {
      margin-top: var(--lumo-space-xl);
    }
  `,
  { include: ['lumo-ordered-layout'], moduleId: 'lumo-vertical-layout' }
);
