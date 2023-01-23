/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Item } from '@vaadin/item/src/vaadin-item.js';

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @extends Item
 * @protected
 */
class ContextMenuItem extends Item {
  static get is() {
    return 'vaadin-context-menu-item';
  }
}

customElements.define(ContextMenuItem.is, ContextMenuItem);
