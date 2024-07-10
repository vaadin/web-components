/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardDirectionMixinClass } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export interface MenuBarItem {
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
  children?: SubMenuItem[];

  /**
   * Class/classes to be set to the class attribute of the button.
   */
  className?: string;
}

export interface SubMenuItem {
  text?: string;
  component?: HTMLElement | string;
  disabled?: boolean;
  theme?: string[] | string;
  checked?: boolean;
  className?: string;
  children?: SubMenuItem[];
}

export interface MenuBarI18n {
  moreOptions: string;
}

export declare function MenuBarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<KeyboardDirectionMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<MenuBarMixinClass> &
  Constructor<ResizeMixinClass> &
  T;

export declare class MenuBarMixinClass {
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
   */
  items: MenuBarItem[];

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
