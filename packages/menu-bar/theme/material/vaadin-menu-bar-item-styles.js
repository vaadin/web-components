import '@vaadin/vaadin-material-styles/typography.js';
import { contextMenuItem } from '@vaadin/context-menu/theme/material/vaadin-context-menu-item-styles.js';
import { item } from '@vaadin/item/theme/material/vaadin-item-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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

registerStyles('vaadin-menu-bar-item', [item, contextMenuItem, menuBarItem], { moduleId: 'material-menu-bar-item' });
