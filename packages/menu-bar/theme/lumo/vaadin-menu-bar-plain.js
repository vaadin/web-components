import { button } from '@vaadin/button/theme/lumo/vaadin-button-styles.js';
import { contextMenuItem } from '@vaadin/context-menu/theme/lumo/vaadin-context-menu-item-styles.js';
import { contextMenuListBox } from '@vaadin/context-menu/theme/lumo/vaadin-context-menu-list-box-styles.js';
import { contextMenuOverlay } from '@vaadin/context-menu/theme/lumo/vaadin-context-menu-overlay-styles.js';
import { item } from '@vaadin/item/theme/lumo/vaadin-item-styles.js';
import { listBox } from '@vaadin/list-box/theme/lumo/vaadin-list-box-styles.js';
import { menuOverlay } from '@vaadin/vaadin-lumo-styles/mixins/menu-overlay.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MenuBar as _MenuBar } from '../../src/vaadin-menu-bar-plain.js';
import { menuBarButton } from './vaadin-menu-bar-button-styles.js';
import { menuBarItem } from './vaadin-menu-bar-item-styles.js';
import { menuBarOverlay } from './vaadin-menu-bar-overlay-styles.js';
import { menuBar } from './vaadin-menu-bar-styles.js';

export class MenuBar extends _MenuBar {
  /**
   * @protected
   * @override
   */
  static registerStyles() {
    registerStyles('vaadin-menu-bar', menuBar, { moduleId: 'lumo-menu-bar' });
    registerStyles('vaadin-menu-bar-button', [button, menuBarButton], {
      moduleId: 'lumo-menu-bar-button',
    });
    registerStyles('vaadin-menu-bar-item', [item, contextMenuItem, menuBarItem], { moduleId: 'lumo-menu-bar-item' });
    registerStyles('vaadin-menu-bar-list-box', [listBox, contextMenuListBox], { moduleId: 'lumo-menu-bar-list-box' });
    registerStyles('vaadin-menu-bar-overlay', [menuOverlay, contextMenuOverlay, menuBarOverlay], {
      moduleId: 'lumo-menu-bar-overlay',
    });
  }
}
