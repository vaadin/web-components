/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
