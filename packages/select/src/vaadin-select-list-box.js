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
import { ListBox } from '@vaadin/list-box/src/vaadin-list-box.js';

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends ListBox
 * @protected
 */
class SelectListBox extends ListBox {
  static get is() {
    return 'vaadin-select-list-box';
  }
}

customElements.define(SelectListBox.is, SelectListBox);
