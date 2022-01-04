/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
