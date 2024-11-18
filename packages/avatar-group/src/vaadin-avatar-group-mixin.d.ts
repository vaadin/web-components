/**
 * @license
 * Copyright (c) 2020 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { AvatarI18n } from '@vaadin/avatar/src/vaadin-avatar.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export interface AvatarGroupI18n extends AvatarI18n {
  activeUsers: {
    one: string;
    many: string;
  };
  joined: string;
  left: string;
}

export interface AvatarGroupItem {
  name?: string;
  abbr?: string;
  img?: string;
  colorIndex?: number;
  className?: string;
}

/**
 * A mixin providing common avatar functionality.
 */
export declare function AvatarGroupMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<AvatarGroupMixinClass> & Constructor<OverlayClassMixinClass> & Constructor<ResizeMixinClass> & T;

export declare class AvatarGroupMixinClass {
  /**
   * An array containing the items which will be stamped as avatars.
   *
   * The items objects allow to configure [`name`](#/elements/vaadin-avatar#property-name),
   * [`abbr`](#/elements/vaadin-avatar#property-abbr), [`img`](#/elements/vaadin-avatar#property-img)
   * and [`colorIndex`](#/elements/vaadin-avatar#property-colorIndex) properties on the
   * stamped avatars, and set `className` to provide CSS class names.
   *
   * #### Example
   *
   * ```js
   * group.items = [
   *   {
   *     name: 'User name',
   *     img: 'url-to-image.png',
   *     className: 'even'
   *   },
   *   {
   *     abbr: 'JD',
   *     colorIndex: 1,
   *     className: 'odd'
   *   },
   * ];
   * ```
   */
  items: AvatarGroupItem[] | undefined;

  /**
   * The maximum number of avatars to display. By default, all the avatars are displayed.
   * When _maxItemsVisible_ is set, the overflowing avatars are grouped into one avatar with
   * a dropdown. Setting 0 or 1 has no effect so there are always at least two avatars visible.
   * @attr {number} max-items-visible
   */
  maxItemsVisible: number | null | undefined;

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * _i18n_ object or just the property you want to modify.
   *
   * The object has the following JSON structure and default values:
   * ```
   * {
   *   // Translation of the anonymous user avatar tooltip.
   *   anonymous: 'anonymous',
   *   // Translation of the avatar group accessible label.
   *   // {count} is replaced with the actual count of users.
   *   activeUsers: {
   *     one: 'Currently one active user',
   *     many: 'Currently {count} active users'
   *   },
   *   // Screen reader announcement when user joins group.
   *   // {user} is replaced with the name or abbreviation.
   *   // When neither is set, "anonymous" is used instead.
   *   joined: '{user} joined',
   *   // Screen reader announcement when user leaves group.
   *   // {user} is replaced with the name or abbreviation.
   *   // When neither is set, "anonymous" is used instead.
   *   left: '{user} left'
   * }
   * ```
   */
  i18n: AvatarGroupI18n;
}
