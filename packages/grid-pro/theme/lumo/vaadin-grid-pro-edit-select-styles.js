import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { gridProEditor } from './vaadin-grid-pro-editor-styles.js';

const gridProEditSelect = css`
  :host([theme~='grid-pro-editor']) [part='toggle-button'] {
    margin-right: var(--lumo-space-xs);
  }

  :host([theme~='grid-pro-editor']) [part='input-field'] ::slotted([slot='value']) {
    box-sizing: border-box;
    padding: 0 var(--lumo-space-m);
    font-size: var(--lumo-font-size-m);
    /* prevent selection on editor focus */
    -webkit-user-select: none;
    user-select: none;
  }
`;

registerStyles('vaadin-grid-pro-edit-select', [gridProEditor, gridProEditSelect], {
  moduleId: 'lumo-grid-pro-edit-select',
});
