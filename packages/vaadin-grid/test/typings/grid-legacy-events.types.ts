import '../../vaadin-grid.js';
import '../../vaadin-grid-filter.js';
import '../../vaadin-grid-selection-column.js';
import '../../vaadin-grid-sorter.js';
import '../../vaadin-grid-sort-column.js';
import '../../vaadin-grid-tree-toggle.js';

import {
  GridActiveItemChanged,
  GridCellActivate,
  GridColumnReorder,
  GridColumnResize,
  GridLoadingChanged,
  GridExpandedItemsChanged,
  GridSelectedItemsChanged,
  GridDragStart,
  GridDrop
} from '../../vaadin-grid.js';
import { GridFilterValueChanged } from '../../vaadin-grid-filter.js';
import { GridSorterDirectionChanged } from '../../vaadin-grid-sorter.js';
import { GridSortColumnDirectionChanged } from '../../vaadin-grid-sort-column.js';
import { GridTreeToggleExpandedChanged } from '../../vaadin-grid-tree-toggle.js';
import { GridSelectionColumnSelectAllChanged } from '../../vaadin-grid-selection-column.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const grid = document.createElement('vaadin-grid');

grid.addEventListener('active-item-changed', (event) => {
  assertType<GridActiveItemChanged>(event);
});

grid.addEventListener('cell-activate', (event) => {
  assertType<GridCellActivate>(event);
});

grid.addEventListener('column-reorder', (event) => {
  assertType<GridColumnReorder>(event);
});

grid.addEventListener('column-resize', (event) => {
  assertType<GridColumnResize>(event);
});

grid.addEventListener('loading-changed', (event) => {
  assertType<GridLoadingChanged>(event);
});

grid.addEventListener('expanded-items-changed', (event) => {
  assertType<GridExpandedItemsChanged>(event);
});

grid.addEventListener('selected-items-changed', (event) => {
  assertType<GridSelectedItemsChanged>(event);
});

grid.addEventListener('grid-dragstart', (event) => {
  assertType<GridDragStart>(event);
});

grid.addEventListener('grid-drop', (event) => {
  assertType<GridDrop>(event);
});

const filter = document.createElement('vaadin-grid-filter');

filter.addEventListener('value-changed', (event) => {
  assertType<GridFilterValueChanged>(event);
});

const selectionColumn = document.createElement('vaadin-grid-selection-column');

selectionColumn.addEventListener('select-all-changed', (event) => {
  assertType<GridSelectionColumnSelectAllChanged>(event);
});

const sorter = document.createElement('vaadin-grid-sorter');

sorter.addEventListener('direction-changed', (event) => {
  assertType<GridSorterDirectionChanged>(event);
});

const sortColumn = document.createElement('vaadin-grid-sort-column');

sortColumn.addEventListener('direction-changed', (event) => {
  assertType<GridSortColumnDirectionChanged>(event);
});

const treeToggle = document.createElement('vaadin-grid-tree-toggle');

treeToggle.addEventListener('expanded-changed', (event) => {
  assertType<GridTreeToggleExpandedChanged>(event);
});
