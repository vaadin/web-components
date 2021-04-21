import { GridElement, GridElementEventMap } from '@vaadin/vaadin-grid/src/vaadin-grid';

import { GridItem } from '@vaadin/vaadin-grid';

import { InlineEditingMixin } from './vaadin-grid-pro-inline-editing-mixin.js';

/**
 * Fired when the user starts editing a grid cell.
 */
export type GridProCellEditStartedEvent = CustomEvent<{
  value: {
    index: number;
    item: GridItem;
    path: string;
  };
}>;

/**
 * Fired before exiting the cell edit mode, if the value has been changed.
 */
export type GridProItemPropertyChangedEvent = CustomEvent<{
  value: {
    index: number;
    item: GridItem;
    path: string;
    value: string | boolean;
  };
}>;

export interface GridProElementEventMap {
  'cell-edit-started': GridProCellEditStartedEvent;

  'item-property-changed': GridProItemPropertyChangedEvent;
}

export interface GridProEventMap extends HTMLElementEventMap, GridProElementEventMap, GridElementEventMap {}

/**
 * `<vaadin-grid-pro>` is a high quality data grid / data table Web Component with extended functionality.
 * It extends `<vaadin-grid>` and adds extra features on top of the basic ones.
 *
 * See [`<vaadin-grid>`](#/elements/vaadin-grid) documentation for details.
 *
 * ```
 * <vaadin-grid-pro></vaadin-grid-pro>
 * ```
 *
 * ### Internal components
 *
 * In addition to `<vaadin-grid-pro>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-grid-pro-edit-checkbox>` - has the same API as [`<vaadin-checkbox>`](#/elements/vaadin-checkbox).
 * - `<vaadin-grid-pro-edit-text-field>` - has the same API as [`<vaadin-text-field>`](#/elements/vaadin-text-field).
 * - `<vaadin-grid-pro-edit-select>` - has the same API as [`<vaadin-select>`](#/elements/vaadin-select).
 *
 * @fires {CustomEvent} active-item-changed - Fired when the `activeItem` property changes.
 * @fires {CustomEvent} cell-activate - Fired when the cell is activated with click or keyboard.
 * @fires {CustomEvent} cell-edit-started - Fired when the user starts editing a grid cell.
 * @fires {CustomEvent} column-reorder - Fired when the columns in the grid are reordered.
 * @fires {CustomEvent} column-resize - Fired when the grid column resize is finished.
 * @fires {CustomEvent} expanded-items-changed - Fired when the `expandedItems` property changes.
 * @fires {CustomEvent} grid-dragstart - Fired when starting to drag grid rows.
 * @fires {CustomEvent} grid-dragend - Fired when the dragging of the rows ends.
 * @fires {CustomEvent} grid-drop - Fired when a drop occurs on top of the grid.
 * @fires {CustomEvent} item-property-changed - Fired before exiting the cell edit mode, if the value has been changed.
 * @fires {CustomEvent} loading-changed - Fired when the `loading` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 */
declare class GridProElement extends InlineEditingMixin(GridElement) {
  static _finalizeClass(): void;

  addEventListener<K extends keyof GridProEventMap>(
    type: K,
    listener: (this: GridProElement, ev: GridProEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof GridProEventMap>(
    type: K,
    listener: (this: GridProElement, ev: GridProEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-pro': GridProElement;
  }
}

export { GridProElement };
