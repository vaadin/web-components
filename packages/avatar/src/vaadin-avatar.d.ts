/**
 * @license
 * Copyright (c) 2020 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export interface AvatarI18n {
  anonymous: string;
}

/**
 * `<vaadin-avatar>` is a Web Component providing avatar displaying functionality.
 *
 * ```html
 * <vaadin-avatar img="avatars/avatar-1.jpg"></vaadin-avatar>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name | Description
 * --------- | ---------------
 * `abbr`    | The abbreviation element
 * `icon`    | The icon element
 *
 * The following state attributes are available for styling:
 *
 * Attribute         | Description
 * ------------------|-------------
 * `focus-ring`      | Set when the avatar is focused using the keyboard.
 * `focused`         | Set when the avatar is focused.
 * `has-color-index` | Set when the avatar has `colorIndex` and the corresponding custom CSS property exists.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 */
declare class Avatar extends FocusMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  /**
   * The path to the image
   */
  img: string | null | undefined;

  /**
   * A shortened form of name that is displayed
   * in the avatar when `img` is not provided.
   */
  abbr: string | null | undefined;

  /**
   * Full name of the user
   * used for the title of the avatar.
   */
  name: string | null | undefined;

  /**
   * Color index used for avatar background.
   * @attr {number} color-index
   */
  colorIndex: number | null | undefined;

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * _i18n_ object or just the property you want to modify.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // Translation of the anonymous user avatar title.
   *   anonymous: 'anonymous'
   * }
   * ```
   */
  i18n: AvatarI18n;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-avatar': Avatar;
  }
}

export { Avatar };
