import { ContextMenu } from '../src/vaadin-context-menu.js';

export interface ContextMenuItem {
  text?: string;
  component?: string | HTMLElement;
  disabled?: boolean;
  checked?: boolean;
  theme?: string | string[];
  children?: ContextMenuItem[];
}

export interface ContextMenuRendererContext {
  target: HTMLElement;
  detail?: { sourceEvent: Event };
}

export type ContextMenuRenderer = (
  root: HTMLElement,
  contextMenu?: ContextMenu,
  context?: ContextMenuRendererContext
) => void;

/**
 * Fired when the `opened` property changes.
 */
export type ContextMenuOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when an item is selected when the context menu is populated using the `items` API.
 */
export type ContextMenuItemSelectedEvent = CustomEvent<{ value: ContextMenuItem }>;

export interface ContextMenuCustomEventMap {
  'opened-changed': ContextMenuOpenedChangedEvent;

  'item-selected': ContextMenuItemSelectedEvent;

  'close-all-menus': Event;

  'items-outside-click': Event;
}

export interface ContextMenuEventMap extends HTMLElementEventMap, ContextMenuCustomEventMap {}
