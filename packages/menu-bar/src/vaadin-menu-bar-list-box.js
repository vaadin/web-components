/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ListBox } from '@vaadin/list-box/src/vaadin-list-box.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @extends ListBox
 * @protected
 */
class MenuBarListBox extends ListBox {
  static get is() {
    return 'vaadin-menu-bar-list-box';
  }
}

customElements.define(MenuBarListBox.is, MenuBarListBox);
