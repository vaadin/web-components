import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuBar = css`
  [part='container'] {
    /* To retain the box-shadow */
    padding-bottom: 5px;
  }

  :host([has-single-button]) ::slotted(vaadin-menu-bar-button) {
    border-radius: 4px;
  }

  :host([theme~='end-aligned']) ::slotted(vaadin-menu-bar-button:first-of-type),
  :host([theme~='end-aligned'][has-single-button]) ::slotted(vaadin-menu-bar-button) {
    margin-inline-start: auto;
  }
`;
export { menuBar };
