import '../../vaadin-grid.js';
import '../../vaadin-grid-filter.js';
import '../../vaadin-grid-selection-column.js';
import '../../vaadin-grid-sorter.js';
import '../../vaadin-grid-sort-column.js';
import '../../vaadin-grid-tree-toggle.js';

import {
  GridColumnElement,
  GridDropLocation,
  GridItem,
  GridItemModel,
  GridSorterDirection,
  GridActiveItemChangedEvent,
  GridCellActivateEvent,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridLoadingChangedEvent,
  GridExpandedItemsChangedEvent,
  GridSelectedItemsChangedEvent,
  GridDragStartEvent,
  GridDropEvent
} from '../../vaadin-grid.js';
import { GridFilterValueChangedEvent } from '../../vaadin-grid-filter.js';
import { GridSorterDirectionChangedEvent } from '../../vaadin-grid-sorter.js';
import { GridSortColumnDirectionChangedEvent } from '../../vaadin-grid-sort-column.js';
import { GridTreeToggleExpandedChangedEvent } from '../../vaadin-grid-tree-toggle.js';
import { GridSelectionColumnSelectAllChangedEvent } from '../../vaadin-grid-selection-column.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const grid = document.createElement('vaadin-grid');

grid.addEventListener('active-item-changed', (event) => {
  assertType<GridActiveItemChangedEvent>(event);
  assertType<GridItem>(event.detail.value);
});

grid.addEventListener('cell-activate', (event) => {
  assertType<GridCellActivateEvent>(event);
  assertType<GridItemModel>(event.detail.model);
});

grid.addEventListener('column-reorder', (event) => {
  assertType<GridColumnReorderEvent>(event);
  assertType<GridColumnElement[]>(event.detail.columns);
});

grid.addEventListener('column-resize', (event) => {
  assertType<GridColumnResizeEvent>(event);
  assertType<GridColumnElement>(event.detail.resizedColumn);
});

grid.addEventListener('loading-changed', (event) => {
  assertType<GridLoadingChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

grid.addEventListener('expanded-items-changed', (event) => {
  assertType<GridExpandedItemsChangedEvent>(event);
  assertType<GridItem[]>(event.detail.value);
});

grid.addEventListener('selected-items-changed', (event) => {
  assertType<GridSelectedItemsChangedEvent>(event);
  assertType<GridItem[]>(event.detail.value);
});

grid.addEventListener('grid-dragstart', (event) => {
  assertType<GridDragStartEvent>(event);
  assertType<GridItem[]>(event.detail.draggedItems);
});

grid.addEventListener('grid-drop', (event) => {
  assertType<GridDropEvent>(event);
  assertType<GridItem>(event.detail.dropTargetItem);
  assertType<GridDropLocation>(event.detail.dropLocation);
});

const filter = document.createElement('vaadin-grid-filter');

filter.addEventListener('value-changed', (event) => {
  assertType<GridFilterValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

const selectionColumn = document.createElement('vaadin-grid-selection-column');

selectionColumn.addEventListener('select-all-changed', (event) => {
  assertType<GridSelectionColumnSelectAllChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

const sorter = document.createElement('vaadin-grid-sorter');

sorter.addEventListener('direction-changed', (event) => {
  assertType<GridSorterDirectionChangedEvent>(event);
  assertType<GridSorterDirection>(event.detail.value);
});

const sortColumn = document.createElement('vaadin-grid-sort-column');

sortColumn.addEventListener('direction-changed', (event) => {
  assertType<GridSortColumnDirectionChangedEvent>(event);
  assertType<GridSorterDirection>(event.detail.value);
});

const treeToggle = document.createElement('vaadin-grid-tree-toggle');

treeToggle.addEventListener('expanded-changed', (event) => {
  assertType<GridTreeToggleExpandedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
