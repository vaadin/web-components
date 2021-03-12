import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import './vaadin-ordered-layout.js';

registerStyles(
  'vaadin-vertical-layout',
  css`
    :host([theme~='spacing-xs']) ::slotted(*) {
      margin-top: 4px;
    }

    :host([theme~='spacing-s']) ::slotted(*) {
      margin-top: 8px;
    }

    :host([theme~='spacing']) ::slotted(*) {
      margin-top: 16px;
    }

    :host([theme~='spacing-l']) ::slotted(*) {
      margin-top: 32px;
    }

    :host([theme~='spacing-xl']) ::slotted(*) {
      margin-top: 64px;
    }

    /* Compensate for the first item margin, so that there is no gap around the layout itself. */
    :host([theme~='spacing-xs'])::before {
      content: '';
      margin-top: -4px;
    }

    :host([theme~='spacing-s'])::before {
      content: '';
      margin-top: -8px;
    }

    :host([theme~='spacing'])::before {
      content: '';
      margin-top: -16px;
    }

    :host([theme~='spacing-l'])::before {
      content: '';
      margin-top: -32px;
    }

    :host([theme~='spacing-xl'])::before {
      content: '';
      margin-top: -64px;
    }
  `,
  { include: ['material-ordered-layout'], moduleId: 'material-vertical-layout' }
);
