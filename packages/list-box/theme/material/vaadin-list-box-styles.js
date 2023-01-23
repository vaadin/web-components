import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const listBox = css`
  :host {
    -webkit-tap-highlight-color: transparent;
    --_material-item-selected-icon-display: block;
  }

  [part='items'] ::slotted(*) {
    cursor: default;
  }

  /* Dividers */
  [part='items'] ::slotted(hr) {
    height: 1px;
    border: 0;
    padding: 0;
    margin: 8px 0;
    background-color: var(--material-divider-color);
  }
`;

registerStyles('vaadin-list-box', listBox, { moduleId: 'material-list-box' });

export { listBox };
