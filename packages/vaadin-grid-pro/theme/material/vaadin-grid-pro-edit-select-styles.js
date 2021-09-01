import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import './vaadin-grid-pro-editor-styles.js';

registerStyles(
  'vaadin-grid-pro-edit-select',
  css`
    :host([theme~='grid-pro-editor']) [part='input-field'] ::slotted([slot='value']) {
      box-sizing: border-box;
      font-size: inherit;
      /* prevent selection on editor focus */
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }
  `,
  { include: ['material-grid-pro-editor'], moduleId: 'material-grid-pro-edit-select' }
);
