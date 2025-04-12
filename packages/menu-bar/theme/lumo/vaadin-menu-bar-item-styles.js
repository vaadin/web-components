import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import { contextMenuItem } from '@vaadin/context-menu/theme/lumo/vaadin-context-menu-item-styles.js';
import { item } from '@vaadin/item/theme/lumo/vaadin-item-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuBarItem = css`
  [part='content'] {
    /* tweak to inherit centering from menu bar button */
    align-items: inherit;
    display: flex;
    justify-content: inherit;
  }

  [part='content'] ::slotted(vaadin-icon) {
    display: inline-block;
    height: var(--lumo-icon-size-m);
    width: var(--lumo-icon-size-m);
  }

  [part='content'] ::slotted(vaadin-icon[icon^='vaadin:']) {
    box-sizing: border-box !important;
    padding: var(--lumo-space-xs);
  }
`;

registerStyles('vaadin-menu-bar-item', [item, contextMenuItem, menuBarItem], { moduleId: 'lumo-menu-bar-item' });
