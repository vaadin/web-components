/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ListMixin } from '@vaadin/a11y-base/src/list-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-select-list-box>` is a Web Component for wrapping `<vaadin-select>` items.
 *
 * ```html
 * <vaadin-select>
 *   <vaadin-select-list-box slot="overlay">
 *     <vaadin-select-item value="foo">Foo</vaadin-select-item>
 *     <vaadin-select-item value="bar">Bar</vaadin-select-item>
 *   </vaadin-select-list-box>
 * </vaadin-select>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|------------------------
 * `items`           | The items container
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class SelectListBox extends ListMixin(DirMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-select-list-box': SelectListBox;
  }
}

export { SelectListBox };
