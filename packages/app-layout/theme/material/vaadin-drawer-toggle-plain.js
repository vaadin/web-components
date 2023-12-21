import { button } from '@vaadin/button/theme/material/vaadin-button-styles.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DrawerToggle as _DrawerToggle } from '../../src/vaadin-drawer-toggle-plain.js';
import { drawerToggle } from './vaadin-drawer-toggle-styles.js';

export class DrawerToggle extends _DrawerToggle {
  /**
   * @protected
   * @override
   */
  static registerStyles() {
    registerStyles('vaadin-drawer-toggle', [button, drawerToggle], { moduleId: 'material-drawer-toggle' });
  }
}
