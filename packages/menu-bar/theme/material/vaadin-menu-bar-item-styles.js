import '@vaadin/vaadin-material-styles/typography.js';
import { contextMenuItem } from '@vaadin/context-menu/theme/material/vaadin-context-menu-item-styles.js';
import { item } from '@vaadin/item/theme/material/vaadin-item-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuBarItem = css`
  [part='content'] {
    /* tweak to inherit centering from menu bar button */
    align-items: inherit;
    display: flex;
    font-size: var(--material-button-font-size);
    justify-content: inherit;
  }

  [part='content'] ::slotted(vaadin-icon[icon^='vaadin:']) {
    box-sizing: border-box !important;
    display: inline-block;
    height: 18px;
    width: 18px;
  }
`;

registerStyles('vaadin-menu-bar-item', [item, contextMenuItem, menuBarItem], { moduleId: 'material-menu-bar-item' });
