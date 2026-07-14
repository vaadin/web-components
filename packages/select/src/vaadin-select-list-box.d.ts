/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ListMixin } from '@vaadin/a11y-base/src/list-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-select-list-box>` is a Web Component for grouping `<vaadin-select-item>`
 * elements to be slotted into the `<vaadin-select>` overlay.
 *
 * It has the same API as `<vaadin-list-box>`, and should be preferred over it
 * for defining the options of `<vaadin-select>`.
 */
declare class SelectListBox extends ListMixin(DirMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-select-list-box': SelectListBox;
  }
}

export { SelectListBox };
