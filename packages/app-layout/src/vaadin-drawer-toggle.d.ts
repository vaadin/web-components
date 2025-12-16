/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * The Drawer Toggle component controls the drawer in App Layout component.
 *
 * ```html
 * <vaadin-app-layout>
 *   <vaadin-drawer-toggle slot="navbar">Toggle drawer</vaadin-drawer-toggle>
 * </vaadin-app-layout>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|------------
 * `icon`       | The icon element
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|------------
 * `focus-ring` | Set when the element is focused using the keyboard
 * `focused`    | Set when the element is focused
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                |
 * :----------------------------------|
 * | `--vaadin-button-background`     |
 * | `--vaadin-button-border-color`   |
 * | `--vaadin-button-border-radius`  |
 * | `--vaadin-button-border-width`   |
 * | `--vaadin-button-font-size`      |
 * | `--vaadin-button-line-height`    |
 * | `--vaadin-button-margin`         |
 * | `--vaadin-button-padding`        |
 * | `--vaadin-button-text-color`     |
 * | `--vaadin-icon-size`             |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class DrawerToggle extends ButtonMixin(DirMixin(ThemableMixin(HTMLElement))) {
  ariaLabel: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-drawer-toggle': DrawerToggle;
  }
}

export { DrawerToggle };
