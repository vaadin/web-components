import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const menuBarButton = css`
  :host {
    flex-shrink: 0;
  }

  :host([slot='overflow']) {
    margin-inline-end: 0;
  }

  [part='label'] ::slotted(vaadin-menu-bar-item) {
    position: relative;
    z-index: 1;
  }
`;
