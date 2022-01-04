/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Item } from '@vaadin/item/src/vaadin-item.js';

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends Item
 * @protected
 */
class SelectItem extends Item {
  static get is() {
    return 'vaadin-select-item';
  }
}

customElements.define(SelectItem.is, SelectItem);
