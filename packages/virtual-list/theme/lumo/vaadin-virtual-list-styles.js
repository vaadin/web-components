import '@vaadin/vaadin-lumo-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin';

const virtualListStyles = css`
  ::slotted(*) {
    outline: none;
  }

  :host([navigating]) ::slotted([focused]) {
    box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  ::slotted([selected]) {
    background-color: var(--lumo-primary-color-10pct);
  }
`;

registerStyles('vaadin-virtual-list', virtualListStyles, { moduleId: 'lumo-virtual-list' });
