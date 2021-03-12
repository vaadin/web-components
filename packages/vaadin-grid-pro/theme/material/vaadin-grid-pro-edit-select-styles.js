import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import './vaadin-grid-pro-editor-styles.js';

registerStyles(
  'vaadin-select-text-field',
  css`
    :host([theme~='grid-pro-editor']) [part='input-field'] ::slotted([part='value']) {
      /* prevent selection on editor focus */
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }
  `,
  { include: ['material-grid-pro-editor'], moduleId: 'material-grid-pro-edit-select-text-field' }
);
