import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import './vaadin-grid-pro-editor-styles.js';

registerStyles(
  'vaadin-grid-pro-edit-select',
  css`
    :host([theme~='grid-pro-editor']) [part='toggle-button'] {
      margin-right: var(--lumo-space-xs);
    }
  `,
  { moduleId: 'lumo-grid-pro-edit-select' }
);

registerStyles(
  'vaadin-select-text-field',
  css`
    :host([theme~='grid-pro-editor']) [part='input-field'] ::slotted([part='value']) {
      padding: 0 var(--lumo-space-m);
      font-size: var(--lumo-font-size-m);

      /* prevent selection on editor focus */
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `,
  { include: ['lumo-grid-pro-editor'], moduleId: 'lumo-grid-pro-edit-select-text-field' }
);
