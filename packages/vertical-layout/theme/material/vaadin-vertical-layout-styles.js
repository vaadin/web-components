import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

const verticalLayout = css`
  [theme~='margin'] {
    margin: 16px;
  }

  [theme~='padding'] {
    padding: 16px;
  }

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
`;

registerStyles('vaadin-vertical-layout', verticalLayout, { moduleId: 'material-vertical-layout' });
