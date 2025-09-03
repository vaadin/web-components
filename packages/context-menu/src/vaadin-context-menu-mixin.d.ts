/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ContextMenuRenderer } from './vaadin-context-menu.js';
import type { ContextMenuItem, ItemsMixinClass } from './vaadin-contextmenu-items-mixin.js';

export declare function ContextMenuMixin<
  T extends Constructor<HTMLElement>,
  TItem extends ContextMenuItem = ContextMenuItem,
>(base: T): Constructor<ContextMenuMixinClass> & Constructor<ItemsMixinClass<TItem>> & T;

export declare class ContextMenuMixinClass {
  /**
   * CSS selector that can be used to target any child element
   * of the context menu to listen for `openOn` events.
   */
  selector: string | null | undefined;

  /**
   * True if the overlay is currently displayed.
   */
  readonly opened: boolean;

  /**
   * Event name to listen for opening the context menu.
   * @attr {string} open-on
   */
  openOn: string;

  /**
   * The target element that's listened to for context menu opening events.
   * By default the vaadin-context-menu listens to the target's `vaadin-contextmenu`
   * events.
   */
  listenOn: HTMLElement;

  /**
   * Event name to listen for closing the context menu.
   * @attr {string} close-on
   */
  closeOn: string;

  /**
   * Custom function for rendering the content of the menu overlay.
   * Receives three arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `contextMenu` The reference to the `<vaadin-context-menu>` element.
   * - `context` The object with the menu context, contains:
   *   - `context.target`  the target of the menu opening event,
   *   - `context.detail` the menu opening event detail.
   */
  renderer: ContextMenuRenderer | null | undefined;

  /**
   * When true, the menu overlay is modeless.
   */
  protected _modeless: boolean;

  /**
   * Requests an update for the content of the menu overlay.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  /**
   * Closes the overlay.
   */
  close(): void;

  /**
   * Opens the overlay.
   *
   * @param e used as the context for the menu. Overlay coordinates are taken from this event.
   */
  open(e: Event | undefined): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export declare interface ContextMenuMixinClass<TItem extends ContextMenuItem = ContextMenuItem>
  extends ItemsMixinClass<TItem> {}
