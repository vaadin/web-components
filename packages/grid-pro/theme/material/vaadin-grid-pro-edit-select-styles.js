import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { gridProEditor } from './vaadin-grid-pro-editor-styles.js';

const gridProEditSelect = css`
  :host([theme~='grid-pro-editor']) [part='input-field'] ::slotted([slot='value']) {
    box-sizing: border-box;
    font-size: inherit;
    /* prevent selection on editor focus */
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
`;

registerStyles('vaadin-grid-pro-edit-select', [gridProEditor, gridProEditSelect], {
  moduleId: 'material-grid-pro-edit-select',
});
