/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';

export interface AvatarI18n {
  anonymous?: string;
}

/**
 * A mixin providing common avatar functionality.
 */
export declare function AvatarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<AvatarMixinClass> & Constructor<I18nMixinClass<AvatarI18n>> & Constructor<FocusMixinClass> & T;

export declare class AvatarMixinClass {
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
   * used for the tooltip of the avatar.
   */
  name: string | null | undefined;

  /**
   * Color index used for avatar background.
   * @attr {number} color-index
   */
  colorIndex: number | null | undefined;

  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   * ```
   * {
   *   // Translation of the anonymous user avatar tooltip.
   *   anonymous: 'anonymous'
   * }
   * ```
   */
  i18n: AvatarI18n;

  /**
   * When true, the avatar has tooltip shown on hover and focus.
   * The tooltip text is based on the `name` and `abbr` properties.
   * When neither is provided, `i18n.anonymous` is used instead.
   * @attr {boolean} with-tooltip
   */
  withTooltip: boolean;
}
