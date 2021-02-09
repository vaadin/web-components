import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import './vaadin-ordered-layout.js';

registerStyles(
  'vaadin-horizontal-layout',
  css`
    :host([theme~='spacing-xs']:not([dir='rtl'])) ::slotted(*) {
      margin-left: var(--lumo-space-xs);
    }

    :host([theme~='spacing-s']:not([dir='rtl'])) ::slotted(*) {
      margin-left: var(--lumo-space-s);
    }

    :host([theme~='spacing']:not([dir='rtl'])) ::slotted(*) {
      margin-left: var(--lumo-space-m);
    }

    :host([theme~='spacing-l']:not([dir='rtl'])) ::slotted(*) {
      margin-left: var(--lumo-space-l);
    }

    :host([theme~='spacing-xl']:not([dir='rtl'])) ::slotted(*) {
      margin-left: var(--lumo-space-xl);
    }

    /* Compensate for the first item margin, so that there is no gap around the layout itself. */
    :host([theme~='spacing-xs'])::before,
    :host([theme~='spacing-s'])::before,
    :host([theme~='spacing'])::before,
    :host([theme~='spacing-l'])::before,
    :host([theme~='spacing-xl'])::before {
      content: '';
    }

    :host([theme~='spacing-xs']:not([dir='rtl']))::before {
      margin-left: calc(var(--lumo-space-xs) * -1);
    }

    :host([theme~='spacing-s']:not([dir='rtl']))::before {
      margin-left: calc(var(--lumo-space-s) * -1);
    }

    :host([theme~='spacing']:not([dir='rtl']))::before {
      margin-left: calc(var(--lumo-space-m) * -1);
    }

    :host([theme~='spacing-l']:not([dir='rtl']))::before {
      margin-left: calc(var(--lumo-space-l) * -1);
    }

    :host([theme~='spacing-xl']:not([dir='rtl']))::before {
      margin-left: calc(var(--lumo-space-xl) * -1);
    }

    /* RTL styles */
    :host([dir='rtl'][theme~='spacing-xs']) ::slotted(*) {
      margin-right: var(--lumo-space-xs);
    }

    :host([dir='rtl'][theme~='spacing-s']) ::slotted(*) {
      margin-right: var(--lumo-space-s);
    }

    :host([dir='rtl'][theme~='spacing']) ::slotted(*) {
      margin-right: var(--lumo-space-m);
    }

    :host([dir='rtl'][theme~='spacing-l']) ::slotted(*) {
      margin-right: var(--lumo-space-l);
    }

    :host([dir='rtl'][theme~='spacing-xl']) ::slotted(*) {
      margin-right: var(--lumo-space-xl);
    }

    /* Compensate for the first item margin, so that there is no gap around the layout itself. */
    :host([dir='rtl'][theme~='spacing-xs'])::before {
      margin-right: calc(var(--lumo-space-xs) * -1);
    }

    :host([dir='rtl'][theme~='spacing-s'])::before {
      margin-right: calc(var(--lumo-space-s) * -1);
    }

    :host([dir='rtl'][theme~='spacing'])::before {
      margin-right: calc(var(--lumo-space-m) * -1);
    }

    :host([dir='rtl'][theme~='spacing-l'])::before {
      margin-right: calc(var(--lumo-space-l) * -1);
    }

    :host([dir='rtl'][theme~='spacing-xl'])::before {
      margin-right: calc(var(--lumo-space-xl) * -1);
    }
  `,
  { include: ['lumo-ordered-layout'], moduleId: 'lumo-horizontal-layout' }
);
