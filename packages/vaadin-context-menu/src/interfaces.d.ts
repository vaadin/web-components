import { ContextMenuElement } from '../src/vaadin-context-menu.js';

export interface ContextMenuItem {
  text?: string;
  component?: string | HTMLElement;
  disabled?: boolean;
  checked?: boolean;
  children?: ContextMenuItem[];
}

export interface ContextMenuRendererContext {
  target: HTMLElement;
  detail?: object;
}

export type ContextMenuRenderer = (
  root: HTMLElement,
  contextMenu?: ContextMenuElement,
  context?: ContextMenuRendererContext
) => void;

/**
 * Fired when the `opened` property changes.
 */
export type ContextMenuOpenedChanged = CustomEvent<{ value: boolean }>;

/**
 * Fired when an item is selected when the context menu is populated using the `items` API.
 */
export type ContextMenuItemSelected = CustomEvent<{ value: ContextMenuItem }>;

export interface ContextMenuElementEventMap {
  'opened-changed': ContextMenuOpenedChanged;

  'item-selected': ContextMenuItemSelected;

  'close-all-menus': Event;

  'items-outside-click': Event;
}

export interface ContextMenuEventMap extends HTMLElementEventMap, ContextMenuElementEventMap {}
