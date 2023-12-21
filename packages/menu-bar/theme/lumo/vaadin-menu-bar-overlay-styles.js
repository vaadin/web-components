import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuBarOverlay = css`
  :host(:first-of-type) {
    padding-top: var(--lumo-space-xs);
  }
`;

export { menuBarOverlay };
