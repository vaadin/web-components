import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const listBox = css`
  :host {
    --_material-item-selected-icon-display: block;
    -webkit-tap-highlight-color: transparent;
  }

  [part='items'] ::slotted(*) {
    cursor: default;
  }

  /* Dividers */
  [part='items'] ::slotted(hr) {
    background-color: var(--material-divider-color);
    border: 0;
    height: 1px;
    margin: 8px 0;
    padding: 0;
  }
`;

registerStyles('vaadin-list-box', listBox, { moduleId: 'material-list-box' });

export { listBox };
