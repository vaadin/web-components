/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-navigation-layout-toggle>` is a button that toggles the `collapsed`
 * state of the closest ancestor `<vaadin-navigation-layout>`.
 *
 * ```html
 * <vaadin-navigation-layout>
 *   <vaadin-navigation-layout-toggle slot="start">Toggle</vaadin-navigation-layout-toggle>
 * </vaadin-navigation-layout>
 * ```
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|------------
 * `focus-ring` | Set when the element is focused using the keyboard
 * `focused`    | Set when the element is focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class NavigationLayoutToggle extends ButtonMixin(DirMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-navigation-layout-toggle': NavigationLayoutToggle;
  }
}

export { NavigationLayoutToggle };
