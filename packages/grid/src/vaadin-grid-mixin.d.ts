/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { ActiveItemMixinClass } from './vaadin-grid-active-item-mixin.js';
import type { ArrayDataProviderMixinClass } from './vaadin-grid-array-data-provider-mixin.js';
import type { GridColumn } from './vaadin-grid-column.js';
import { GridBodyRenderer, GridHeaderFooterRenderer } from './vaadin-grid-column.js';
import type { ColumnReorderingMixinClass } from './vaadin-grid-column-reordering-mixin.js';
import type { DataProviderMixinClass } from './vaadin-grid-data-provider-mixin.js';
import {
  GridDataProvider,
  GridDataProviderCallback,
  GridDataProviderParams,
  GridFilterDefinition,
  GridSorterDefinition,
  GridSorterDirection,
} from './vaadin-grid-data-provider-mixin.js';
import type { DragAndDropMixinClass } from './vaadin-grid-drag-and-drop-mixin.js';
import { GridDragAndDropFilter, GridDropLocation, GridDropMode } from './vaadin-grid-drag-and-drop-mixin.js';
import type { EventContextMixinClass } from './vaadin-grid-event-context-mixin.js';
import { GridEventContext } from './vaadin-grid-event-context-mixin.js';
import type { RowDetailsMixinClass } from './vaadin-grid-row-details-mixin.js';
import { GridRowDetailsRenderer } from './vaadin-grid-row-details-mixin.js';
import type { ScrollMixinClass } from './vaadin-grid-scroll-mixin.js';
import type { SelectionMixinClass } from './vaadin-grid-selection-mixin.js';
import type { SortMixinClass } from './vaadin-grid-sort-mixin.js';
import type {
  GridCellClassNameGenerator,
  GridCellPartNameGenerator,
  StylingMixinClass,
} from './vaadin-grid-styling-mixin.js';

export {
  GridBodyRenderer,
  GridCellClassNameGenerator,
  GridCellPartNameGenerator,
  GridDataProvider,
  GridDataProviderCallback,
  GridDataProviderParams,
  GridDragAndDropFilter,
  GridDropLocation,
  GridDropMode,
  GridEventContext,
  GridFilterDefinition,
  GridHeaderFooterRenderer,
  GridRowDetailsRenderer,
  GridSorterDefinition,
  GridSorterDirection,
};

export interface GridItemModel<TItem> {
  index: number;
  item: TItem;
  selected?: boolean;
  expanded?: boolean;
  level?: number;
  detailsOpened?: boolean;
}

/**
 * Fired when the `activeItem` property changes.
 */
export type GridActiveItemChangedEvent<TItem> = CustomEvent<{ value: TItem | null | undefined }>;

/**
 * Fired when the cell is activated with click or keyboard.
 */
export type GridCellActivateEvent<TItem> = CustomEvent<{ model: GridItemModel<TItem> }>;

/**
 * Fired when a cell is focused with click or keyboard navigation.
 */
export type GridCellFocusEvent<TItem> = CustomEvent<{ context: GridEventContext<TItem> }>;

/**
 * Fired when the columns in the grid are reordered.
 */
export type GridColumnReorderEvent<TItem> = CustomEvent<{ columns: Array<GridColumn<TItem>> }>;

/**
 * Fired when the grid column resize is finished.
 */
export type GridColumnResizeEvent<TItem> = CustomEvent<{ resizedColumn: GridColumn<TItem> }>;

/**
 * Fired when the `dataProvider` property changes.
 */
export type GridDataProviderChangedEvent<TItem> = CustomEvent<{ value: GridDataProvider<TItem> }>;

/**
 * Fired when the `expandedItems` property changes.
 */
export type GridExpandedItemsChangedEvent<TItem> = CustomEvent<{ value: TItem[] }>;

/**
 * Fired when starting to drag grid rows.
 */
export type GridDragStartEvent<TItem> = CustomEvent<{
  draggedItems: TItem[];
  setDraggedItemsCount(count: number): void;
  setDragData(type: string, data: string): void;
}>;

/**
 * Fired when a drop occurs on top of the grid.
 */
export type GridDropEvent<TItem> = CustomEvent<{
  dropTargetItem: TItem;
  dropLocation: GridDropLocation;
  dragData: Array<{ type: string; data: string }>;
}>;

/**
 * Fired when the `loading` property changes.
 */
export type GridLoadingChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `selectedItems` property changes.
 */
export type GridSelectedItemsChangedEvent<TItem> = CustomEvent<{ value: TItem[] }>;

/**
 * Fired when the `size` property changes.
 */
export type GridSizeChangedEvent = CustomEvent<{ value: number }>;

export interface GridCustomEventMap<TItem> {
  'active-item-changed': GridActiveItemChangedEvent<TItem>;

  'cell-activate': GridCellActivateEvent<TItem>;

  'cell-focus': GridCellFocusEvent<TItem>;

  'column-reorder': GridColumnReorderEvent<TItem>;

  'column-resize': GridColumnResizeEvent<TItem>;

  'data-provider-changed': GridDataProviderChangedEvent<TItem>;

  'expanded-items-changed': GridExpandedItemsChangedEvent<TItem>;

  'grid-dragstart': GridDragStartEvent<TItem>;

  'grid-dragend': Event;

  'grid-drop': GridDropEvent<TItem>;

  'loading-changed': GridLoadingChangedEvent;

  'selected-items-changed': GridSelectedItemsChangedEvent<TItem>;

  'size-changed': GridSizeChangedEvent;
}

export interface GridEventMap<TItem> extends HTMLElementEventMap, GridCustomEventMap<TItem> {}

export declare function GridMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ActiveItemMixinClass<TItem>> &
  Constructor<ArrayDataProviderMixinClass<TItem>> &
  Constructor<ColumnReorderingMixinClass> &
  Constructor<DataProviderMixinClass<TItem>> &
  Constructor<DisabledMixinClass> &
  Constructor<DragAndDropMixinClass<TItem>> &
  Constructor<EventContextMixinClass<TItem>> &
  Constructor<GridMixinClass<TItem>> &
  Constructor<RowDetailsMixinClass<TItem>> &
  Constructor<ScrollMixinClass> &
  Constructor<SelectionMixinClass<TItem>> &
  Constructor<SortMixinClass> &
  Constructor<StylingMixinClass<TItem>> &
  T;

export interface GridMixinClass<TItem>
  extends DisabledMixinClass,
    ActiveItemMixinClass<TItem>,
    ArrayDataProviderMixinClass<TItem>,
    DataProviderMixinClass<TItem>,
    RowDetailsMixinClass<TItem>,
    ScrollMixinClass,
    SelectionMixinClass<TItem>,
    SortMixinClass,
    ColumnReorderingMixinClass,
    EventContextMixinClass<TItem>,
    StylingMixinClass<TItem>,
    DragAndDropMixinClass<TItem> {
  /**
   * If true, the grid's height is defined by its rows.
   *
   * Effectively, this disables the grid's virtual scrolling so that all the rows are rendered in the DOM at once.
   * If the grid has a large number of items, using the feature is discouraged to avoid performance issues.
   * @attr {boolean} all-rows-visible
   */
  allRowsVisible: boolean;

  /**
   * Updates the `width` of all columns which have `autoWidth` set to `true`.
   */
  recalculateColumnWidths(): void;

  /**
   * Requests an update for the content of cells.
   *
   * While performing the update, the following renderers are invoked:
   * - `Grid.rowDetailsRenderer`
   * - `GridColumn.renderer`
   * - `GridColumn.headerRenderer`
   * - `GridColumn.footerRenderer`
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;
}
