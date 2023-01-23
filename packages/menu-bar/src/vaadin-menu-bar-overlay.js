/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ContextMenuOverlay } from '@vaadin/context-menu/src/vaadin-context-menu-overlay.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @extends ContextMenuOverlay
 * @private
 */
class MenuBarOverlay extends ContextMenuOverlay {
  static get is() {
    return 'vaadin-menu-bar-overlay';
  }
}

customElements.define(MenuBarOverlay.is, MenuBarOverlay);
