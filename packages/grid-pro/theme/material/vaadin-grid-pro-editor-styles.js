import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const gridProEditor = css`
  :host([theme~='grid-pro-editor']) {
    top: 6px;
    width: 100%;
    margin: -6px 0 0;
    padding: 0;
    font-size: inherit;
    will-change: transform;
  }

  :host([theme~='grid-pro-editor']) ::slotted(input) {
    box-sizing: border-box;
    font-size: inherit;
  }
`;

registerStyles('', gridProEditor, { moduleId: 'material-grid-pro-editor' });

export { gridProEditor };
