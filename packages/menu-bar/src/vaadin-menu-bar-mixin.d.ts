/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardDirectionMixinClass } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

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
  moreOptions: string;
}

export declare function MenuBarMixin<T extends Constructor<HTMLElement>, TItem extends MenuBarItem = MenuBarItem>(
  base: T,
): Constructor<ControllerMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
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
   * #### Disabled buttons
   *
   * When disabled, menu bar buttons (root-level items) are rendered
   * as "dimmed" and prevent all user interactions (mouse and keyboard).
   *
   * Since disabled buttons are not focusable and cannot react to hover
   * events by default, it can cause accessibility issues by making them
   * entirely invisible to assistive technologies, and prevents the use
   * of Tooltips to explain why the action is not available. This can be
   * addressed by enabling the feature flag `accessibleDisabledButtons`,
   * which makes disabled buttons focusable and hoverable, while still
   * preventing them from being triggered:
   *
   * ```
   * // Set before any menu bar is attached to the DOM.
   * window.Vaadin.featureFlags.accessibleDisabledButtons = true;
   * ```
   */
  items: TItem[];

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * `i18n` object with a custom one.
   *
   * To update individual properties, extend the existing i18n object like so:
   * ```
   * menuBar.i18n = {
   *   ...menuBar.i18n,
   *   moreOptions: 'More options'
   * }
   * ```
   *
   * The object has the following JSON structure and default values:
   * ```
   * {
   *   moreOptions: 'More options'
   * }
   * ```
   */
  i18n: MenuBarI18n;

  /**
   * A space-delimited list of CSS class names
   * to set on each sub-menu overlay element.
   *
   * @attr {string} overlay-class
   */
  overlayClass: string;

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

  protected readonly _buttons: HTMLElement[];

  protected readonly _container: HTMLElement;

  protected readonly _overflow: HTMLElement;

  protected _hasOverflow: boolean;
}

export declare interface MenuBarMixinClass
  extends ControllerMixinClass,
    DisabledMixinClass,
    FocusMixinClass,
    KeyboardDirectionMixinClass,
    KeyboardMixinClass,
    ResizeMixinClass {}
