import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import './vaadin-ordered-layout.js';

registerStyles(
  'vaadin-vertical-layout',
  css`
    :host([theme~='spacing-xs']) ::slotted(*:not(:first-child)) {
      margin-top: 4px;
    }

    :host([theme~='spacing-s']) ::slotted(*:not(:first-child)) {
      margin-top: 8px;
    }

    :host([theme~='spacing']) ::slotted(*:not(:first-child)) {
      margin-top: 16px;
    }

    :host([theme~='spacing-l']) ::slotted(*:not(:first-child)) {
      margin-top: 32px;
    }

    :host([theme~='spacing-xl']) ::slotted(*:not(:first-child)) {
      margin-top: 64px;
    }
  `,
  { include: ['material-ordered-layout'], moduleId: 'material-vertical-layout' }
);
