/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AvatarMixin } from './vaadin-avatar-mixin.js';

export { AvatarI18n } from './vaadin-avatar-mixin.js';

/**
 * `<vaadin-avatar>` is a Web Component providing avatar displaying functionality.
 *
 * ```html
 * <vaadin-avatar img="avatars/avatar-1.jpg"></vaadin-avatar>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * --------- | ---------------
 * `abbr`    | The abbreviation element
 * `icon`    | The icon element
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property            | Description
 * -------------------------------|-------------
 * `--vaadin-avatar-background`   | Background color of the avatar
 * `--vaadin-avatar-border-color` | Border color of the avatar
 * `--vaadin-avatar-border-width` | Border width of the avatar
 * `--vaadin-avatar-font-size`    | Font size of the avatar
 * `--vaadin-avatar-font-weight`  | Font weight of the avatar
 * `--vaadin-avatar-size`         | Size of the avatar
 * `--vaadin-avatar-text-color`   | Text color of the avatar
 *
 * The following state attributes are available for styling:
 *
 * Attribute         | Description
 * ------------------|-------------
 * `focus-ring`      | Set when the avatar is focused using the keyboard.
 * `focused`         | Set when the avatar is focused.
 * `has-color-index` | Set when the avatar has `colorIndex` and the corresponding custom CSS property exists.
 * `has-tooltip`     | Set when the element has a slotted tooltip.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Avatar extends AvatarMixin(ElementMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-avatar': Avatar;
  }
}

export { Avatar };
