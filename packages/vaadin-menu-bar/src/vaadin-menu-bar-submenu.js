/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ContextMenuElement } from '@vaadin/vaadin-context-menu/src/vaadin-context-menu.js';

/**
 * @extends PolymerElement
 */
class MenuBarSubmenuElement extends ContextMenuElement {
  static get is() {
    return 'vaadin-menu-bar-submenu';
  }

  constructor() {
    super();

    this.openOn = 'opensubmenu';
  }

  /**
   * Overriding the observer to not add global "contextmenu" listener.
   */
  _openedChanged(opened) {
    this.$.overlay.opened = opened;
  }

  /**
   * Overriding the public method to reset expanded button state.
   */
  close() {
    super.close();

    // only handle 1st level submenu
    if (this.hasAttribute('is-root')) {
      this.getRootNode().host._close();
    }
  }
}

customElements.define(MenuBarSubmenuElement.is, MenuBarSubmenuElement);
