/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 */
declare class ContextMenuItem extends ItemMixin(DirMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-context-menu-item': ContextMenuItem;
  }
}

export { ContextMenuItem };
