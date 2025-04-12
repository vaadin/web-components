import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const listBox = css`
  :host {
    --_lumo-item-selected-icon-display: var(--_lumo-list-box-item-selected-icon-display, block);
    -webkit-tap-highlight-color: transparent;
  }

  /* Dividers */
  [part='items'] ::slotted(hr) {
    height: 1px;
    margin: var(--lumo-space-s) var(--lumo-border-radius-m);
    padding: 0;
    border: 0;
    background-color: var(--lumo-contrast-10pct);
  }
`;

registerStyles('vaadin-list-box', listBox, { moduleId: 'lumo-list-box' });

export { listBox };
