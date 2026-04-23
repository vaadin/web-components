/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardDirectionMixinClass } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { MenuBarButton } from './vaadin-menu-bar-button.js';

export type MenuBarItem<TItemData extends object = object> = {
  /**
   * Text to be set as the menu button component's textContent.
   */
  text?: string;
  /**
   * Text to be set as the menu button's tooltip.
   * Requires a `<vaadin-tooltip slot="tooltip">` element to be added inside the `<vaadin-menu-bar>`.
   */
  tooltip?: string;
  /**
   * The component to represent the button content.
   * Either a tagName or an element instance. Defaults to "vaadin-menu-bar-item".
   */
  component?: HTMLElement | string;
  /**
   * If true, the button is disabled and cannot be activated.
   */
  disabled?: boolean;
  /**
   * Theme(s) to be set as the theme attribute of the button, overriding any theme set on the menu bar.
   */
  theme?: string[] | string;
  /**
   * Array of submenu items.
   */
  children?: Array<SubMenuItem<TItemData>>;

  /**
   * Class/classes to be set to the class attribute of the button.
   */
  className?: string;
} & TItemData;

export type SubMenuItem<TItemData extends object = object> = {
  text?: string;
  component?: HTMLElement | string;
  disabled?: boolean;
  theme?: string[] | string;
  checked?: boolean;
  className?: string;
  children?: Array<SubMenuItem<TItemData>>;
} & TItemData;

export interface MenuBarI18n {
  moreOptions?: string;
}

export declare function MenuBarMixin<T extends Constructor<HTMLElement>, TItem extends MenuBarItem = MenuBarItem>(
  base: T,
): Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<I18nMixinClass<MenuBarI18n>> &
  Constructor<KeyboardDirectionMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<MenuBarMixinClass<TItem>> &
  Constructor<ResizeMixinClass> &
  T;

export declare class MenuBarMixinClass<TItem extends MenuBarItem = MenuBarItem> {
  /**
   * Defines a hierarchical structure, where root level items represent menu bar buttons,
   * and `children` property configures a submenu with items to be opened below
   * the button on click, Enter, Space, Up and Down arrow keys.
   *
   * #### Example
   *
   * ```js
   * menubar.items = [
   *   {
   *     text: 'File',
   *     className: 'file',
   *     children: [
   *       {text: 'Open', className: 'file open'}
   *       {text: 'Auto Save', checked: true},
   *     ]
   *   },
   *   {component: 'hr'},
   *   {
   *     text: 'Edit',
   *     children: [
   *       {text: 'Undo', disabled: true},
   *       {text: 'Redo'}
   *     ]
   *   },
   *   {text: 'Help'}
   * ];
   * ```
   *
   * #### Disabled items
   *
   * When disabled, menu bar items are rendered as "dimmed".
   *
   * By default, disabled items are not focusable and don't react to hover.
   * As a result, they are hidden from assistive technologies, and it's not
   * possible to show a tooltip to explain why they are disabled. This can be
   * addressed by enabling several feature flags, which makes disabled items
   * focusable and hoverable, while still preventing them from being activated:
   *
   * ```js
   * // Allow focus and hover interactions with disabled menu bar root items (buttons)
   * window.Vaadin.featureFlags.accessibleDisabledButtons = true;
   *
   * // Allow focus and hover interactions with disabled menu bar sub-menu items
   * window.Vaadin.featureFlags.accessibleDisabledMenuItems = true;
   * ```
   *
   * Both flags must be set before any menu bar is attached to the DOM.
   */
  items: TItem[];

  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   * ```js
   * {
   *   moreOptions: 'More options'
   * }
   * ```
   */
  i18n: MenuBarI18n;

  /**
   * If true, the submenu will open on hover (mouseover) instead of click.
   * @attr {boolean} open-on-hover
   */
  openOnHover: boolean | null | undefined;

  /**
   * If true, the buttons will be collapsed into the overflow menu
   * starting from the "start" end of the bar instead of the "end".
   * @attr {boolean} reverse-collapse
   */
  reverseCollapse: boolean | null | undefined;

  /**
   * If true, the top-level menu items is traversable by tab
   * instead of arrow keys (i.e. disabling roving tabindex)
   * @attr {boolean} tab-navigation
   */
  tabNavigation: boolean | null | undefined;

  /**
   * Closes the current submenu.
   */
  close(): void;

  protected readonly _buttons: MenuBarButton[];

  protected readonly _container: HTMLElement;

  protected readonly _overflow: MenuBarButton;

  protected _hasOverflow: boolean;
}

export declare interface MenuBarMixinClass
  extends DisabledMixinClass, FocusMixinClass, KeyboardDirectionMixinClass, KeyboardMixinClass, ResizeMixinClass {}
