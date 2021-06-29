import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import './vaadin-ordered-layout.js';

registerStyles(
  'vaadin-horizontal-layout',
  css`
    :host([theme~='spacing-xs']:not([dir='rtl'])) ::slotted(*:not(:first-child)) {
      margin-left: var(--lumo-space-xs);
    }

    :host([theme~='spacing-s']:not([dir='rtl'])) ::slotted(*:not(:first-child)) {
      margin-left: var(--lumo-space-s);
    }

    :host([theme~='spacing']:not([dir='rtl'])) ::slotted(*:not(:first-child)) {
      margin-left: var(--lumo-space-m);
    }

    :host([theme~='spacing-l']:not([dir='rtl'])) ::slotted(*:not(:first-child)) {
      margin-left: var(--lumo-space-l);
    }

    :host([theme~='spacing-xl']:not([dir='rtl'])) ::slotted(*:not(:first-child)) {
      margin-left: var(--lumo-space-xl);
    }

    /* RTL styles */
    :host([dir='rtl'][theme~='spacing-xs']) ::slotted(*:not(:first-child)) {
      margin-right: var(--lumo-space-xs);
    }

    :host([dir='rtl'][theme~='spacing-s']) ::slotted(*:not(:first-child)) {
      margin-right: var(--lumo-space-s);
    }

    :host([dir='rtl'][theme~='spacing']) ::slotted(*:not(:first-child)) {
      margin-right: var(--lumo-space-m);
    }

    :host([dir='rtl'][theme~='spacing-l']) ::slotted(*:not(:first-child)) {
      margin-right: var(--lumo-space-l);
    }

    :host([dir='rtl'][theme~='spacing-xl']) ::slotted(*:not(:first-child)) {
      margin-right: var(--lumo-space-xl);
    }
  `,
  { include: ['lumo-ordered-layout'], moduleId: 'lumo-horizontal-layout' }
);
