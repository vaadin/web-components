import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import './vaadin-ordered-layout.js';

registerStyles(
  'vaadin-horizontal-layout',
  css`
    :host([theme~='spacing-xs']:not([dir='rtl'])) ::slotted(*:not(:first-child)) {
      margin-left: 4px;
    }

    :host([theme~='spacing-s']:not([dir='rtl'])) ::slotted(*:not(:first-child)) {
      margin-left: 8px;
    }

    :host([theme~='spacing']:not([dir='rtl'])) ::slotted(*:not(:first-child)) {
      margin-left: 16px;
    }

    :host([theme~='spacing-l']:not([dir='rtl'])) ::slotted(*:not(:first-child)) {
      margin-left: 24px;
    }

    :host([theme~='spacing-xl']:not([dir='rtl'])) ::slotted(*:not(:first-child)) {
      margin-left: 40px;
    }

    /* RTL styles */
    :host([dir='rtl'][theme~='spacing-xs']) ::slotted(*:not(:first-child)) {
      margin-right: 4px;
    }

    :host([dir='rtl'][theme~='spacing-s']) ::slotted(*:not(:first-child)) {
      margin-right: 8px;
    }

    :host([dir='rtl'][theme~='spacing']) ::slotted(*:not(:first-child)) {
      margin-right: 16px;
    }

    :host([dir='rtl'][theme~='spacing-l']) ::slotted(*:not(:first-child)) {
      margin-right: 24px;
    }

    :host([dir='rtl'][theme~='spacing-xl']) ::slotted(*:not(:first-child)) {
      margin-right: 40px;
    }
  `,
  { include: ['material-ordered-layout'], moduleId: 'material-horizontal-layout' }
);
