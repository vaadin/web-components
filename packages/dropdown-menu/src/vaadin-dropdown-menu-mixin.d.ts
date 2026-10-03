/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ContextMenuItemData } from '@vaadin/context-menu/src/vaadin-contextmenu-items-mixin.js';

export type DropdownMenuPosition = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';

export declare function DropdownMenuMixin<
  T extends Constructor<HTMLElement>,
  TItem extends ContextMenuItemData = ContextMenuItemData,
>(base: T): Constructor<DropdownMenuMixinClass<TItem>> & T;

export declare class DropdownMenuMixinClass<TItem extends ContextMenuItemData = ContextMenuItemData> {
  /**
   * A text that is displayed in the button, if no
   * element is assigned to the `button` slot.
   */
  label: string | null | undefined;

  /**
   * Position of the menu with respect to the button.
   * Supported values: `bottom-start`, `bottom-end`, `top-start`, `top-end`.
   * Defaults to `bottom-start` when set to an empty value.
   */
  position: DropdownMenuPosition;

  /**
   * When true, the button is disabled and the menu cannot be opened.
   */
  disabled: boolean;

  /**
   * Defines a string value that labels the button.
   * Use it when the button has no visible text, e.g. an icon-only button.
   * @attr {string} accessible-name
   */
  accessibleName: string | null | undefined;

  /**
   * Defines a (hierarchical) menu structure for the component.
   * If a menu item has a non-empty `children` set, a sub-menu with the child items is opened
   * next to the parent menu on mouseover, tap or a right arrow keypress.
   */
  items: TItem[] | undefined;

  /**
   * True if the menu is currently displayed.
   */
  readonly opened: boolean;

  /**
   * Closes the menu.
   */
  close(): void;
}
