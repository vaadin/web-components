import '@vaadin/vaadin-material-styles/typography.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuBarItem = css`
  [part='content'] {
    display: flex;
    /* tweak to inherit centering from menu bar button */
    align-items: inherit;
    justify-content: inherit;
    font-size: var(--material-button-font-size);
  }

  [part='content'] ::slotted(vaadin-icon[icon^='vaadin:']) {
    display: inline-block;
    width: 18px;
    height: 18px;
    box-sizing: border-box !important;
  }
`;

export { menuBarItem };
