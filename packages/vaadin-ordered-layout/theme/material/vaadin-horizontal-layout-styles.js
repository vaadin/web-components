import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import './vaadin-ordered-layout.js';

registerStyles(
  'vaadin-horizontal-layout',
  css`
    :host([theme~='spacing-xs']:not([dir='rtl'])) ::slotted(*) {
      margin-left: 4px;
    }

    :host([theme~='spacing-s']:not([dir='rtl'])) ::slotted(*) {
      margin-left: 8px;
    }

    :host([theme~='spacing']:not([dir='rtl'])) ::slotted(*) {
      margin-left: 16px;
    }

    :host([theme~='spacing-l']:not([dir='rtl'])) ::slotted(*) {
      margin-left: 24px;
    }

    :host([theme~='spacing-xl']:not([dir='rtl'])) ::slotted(*) {
      margin-left: 40px;
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
      margin-left: -4px;
    }

    :host([theme~='spacing-s']:not([dir='rtl']))::before {
      margin-left: -8px;
    }

    :host([theme~='spacing']:not([dir='rtl']))::before {
      margin-left: -16px;
    }

    :host([theme~='spacing-l']:not([dir='rtl']))::before {
      margin-left: -24px;
    }

    :host([theme~='spacing-xl']:not([dir='rtl']))::before {
      margin-left: -40px;
    }

    /* RTL styles */
    :host([dir='rtl'][theme~='spacing-xs']) ::slotted(*) {
      margin-right: 4px;
    }

    :host([dir='rtl'][theme~='spacing-s']) ::slotted(*) {
      margin-right: 8px;
    }

    :host([dir='rtl'][theme~='spacing']) ::slotted(*) {
      margin-right: 16px;
    }

    :host([dir='rtl'][theme~='spacing-l']) ::slotted(*) {
      margin-right: 24px;
    }

    :host([dir='rtl'][theme~='spacing-xl']) ::slotted(*) {
      margin-right: 40px;
    }

    /* Compensate for the first item margin, so that there is no gap around the layout itself. */
    :host([dir='rtl'][theme~='spacing-xs'])::before {
      margin-right: -4px;
    }

    :host([dir='rtl'][theme~='spacing-s'])::before {
      margin-right: -8px;
    }

    :host([dir='rtl'][theme~='spacing'])::before {
      margin-right: -16px;
    }

    :host([dir='rtl'][theme~='spacing-l'])::before {
      margin-right: -24px;
    }

    :host([dir='rtl'][theme~='spacing-xl'])::before {
      margin-right: -40px;
    }
  `,
  { include: ['material-ordered-layout'], moduleId: 'material-horizontal-layout' }
);
