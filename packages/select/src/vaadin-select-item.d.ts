/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-select-item>` is a Web Component providing layout for items in the
 * `<vaadin-select-list-box>` that is slotted into the `<vaadin-select>` overlay.
 *
 * It has the same API as `<vaadin-item>`, and should be preferred over it for
 * items placed directly inside `<vaadin-select>`.
 */
declare class SelectItem extends ItemMixin(DirMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-select-item': SelectItem;
  }
}

export { SelectItem };
