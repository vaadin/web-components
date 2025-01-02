/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { GridItemModel } from './vaadin-grid.js';

export type GridDragAndDropFilter<TItem> = (model: GridItemModel<TItem>) => boolean;

export type GridDropLocation = 'above' | 'below' | 'empty' | 'on-top';

export type GridDropMode = 'between' | 'on-grid' | 'on-top-or-between' | 'on-top';

export declare function DragAndDropMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DragAndDropMixinClass<TItem>> & T;

export declare class DragAndDropMixinClass<TItem> {
  /**
   * Defines the locations within the Grid row where an element can be dropped.
   *
   * Possible values are:
   * - `between`: The drop event can happen between Grid rows.
   * - `on-top`: The drop event can happen on top of Grid rows.
   * - `on-top-or-between`: The drop event can happen either on top of or between Grid rows.
   * - `on-grid`: The drop event will not happen on any specific row, it will show the drop target outline around the whole grid.
   * @attr {between|on-top|on-top-or-between|on-grid} drop-mode
   */
  dropMode: GridDropMode | null | undefined;

  /**
   * Marks the grid's rows to be available for dragging.
   * @attr {boolean} rows-draggable
   */
  rowsDraggable: boolean | null | undefined;

  /**
   * A function that filters dragging of specific grid rows. The return value should be false
   * if dragging of the row should be disabled.
   *
   * Receives one argument:
   * - `model` The object with the properties related with
   *   the rendered item, contains:
   *   - `model.index` The index of the item.
   *   - `model.item` The item.
   *   - `model.expanded` Sublevel toggle state.
   *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
   *   - `model.selected` Selected state.
   */
  dragFilter: GridDragAndDropFilter<TItem> | null | undefined;

  /**
   * A function that filters dropping on specific grid rows. The return value should be false
   * if dropping on the row should be disabled.
   *
   * Receives one argument:
   * - `model` The object with the properties related with
   *   the rendered item, contains:
   *   - `model.index` The index of the item.
   *   - `model.item` The item.
   *   - `model.expanded` Sublevel toggle state.
   *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
   *   - `model.selected` Selected state.
   */
  dropFilter: GridDragAndDropFilter<TItem> | null | undefined;

  /**
   * Runs the `dragFilter` and `dropFilter` hooks for the visible cells.
   * If the filter depends on varying conditions, you may need to
   * call this function manually in order to update the draggability when
   * the conditions change.
   */
  filterDragAndDrop(): void;
}
