/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ListBox } from '@vaadin/list-box/src/vaadin-list-box.js';

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @protected
 */
declare class ContextMenuListBox extends ListBox {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-context-menu-list-box': ContextMenuListBox;
  }
}
