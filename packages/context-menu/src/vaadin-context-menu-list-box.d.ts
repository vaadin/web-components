/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ListMixin } from '@vaadin/a11y-base/src/list-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-context-menu-list-box>` is a Web Component for wrapping `<vaadin-context-menu>` items.
 *
 * ```html
 * <vaadin-context-menu>
 *   <vaadin-context-menu-list-box slot="overlay">
 *     <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
 *     <vaadin-context-menu-item>Delete</vaadin-context-menu-item>
 *   </vaadin-context-menu-list-box>
 * </vaadin-context-menu>
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
declare class ContextMenuListBox extends ListMixin(DirMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-context-menu-list-box': ContextMenuListBox;
  }
}

export { ContextMenuListBox };
