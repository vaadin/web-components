import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const gridProEditor = css`
  :host([theme~='grid-pro-editor']) {
    width: 100%;
    margin: -6px 0 0;
    padding: 0;
    top: 6px;
    will-change: transform;
    font-size: inherit;
  }

  :host([theme~='grid-pro-editor']) ::slotted(input) {
    box-sizing: border-box;
    font-size: inherit;
  }
`;

registerStyles('', gridProEditor, { moduleId: 'material-grid-pro-editor' });

export { gridProEditor };
