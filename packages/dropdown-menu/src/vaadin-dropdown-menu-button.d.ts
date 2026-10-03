/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';

/**
 * `<vaadin-dropdown-menu-button>` is the button that opens the menu of `<vaadin-dropdown-menu>`.
 * Place it in the `button` slot of `<vaadin-dropdown-menu>` to customize the button content:
 *
 * ```html
 * <vaadin-dropdown-menu>
 *   <vaadin-dropdown-menu-button slot="button">
 *     <vaadin-icon icon="vaadin:cog" slot="prefix"></vaadin-icon>
 *     Settings
 *   </vaadin-dropdown-menu-button>
 * </vaadin-dropdown-menu>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|------------------------------------------
 * `label`     | The label (text) inside the button
 * `prefix`    | A slot for content before the label (e.g. an icon)
 * `suffix`    | A slot for content after the label (e.g. an icon)
 * `indicator` | The dropdown indicator after the suffix
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `active`     | Set when the button is pressed down, or while the menu is open
 * `disabled`   | Set when the button is disabled
 * `expanded`   | Set while the menu is open
 * `focus-ring` | Set when the button is focused using the keyboard
 * `focused`    | Set when the button is focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @slot - Default slot for the button label
 * @slot prefix - Slot for content before the label (e.g. an icon)
 * @slot suffix - Slot for content after the label (e.g. an icon)
 */
declare class DropdownMenuButton extends ButtonMixin(DirMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dropdown-menu-button': DropdownMenuButton;
  }
}

export { DropdownMenuButton };
