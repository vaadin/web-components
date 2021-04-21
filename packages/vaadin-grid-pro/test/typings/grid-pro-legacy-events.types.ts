import {
  GridActiveItemChanged,
  GridCellActivate,
  GridColumnReorder,
  GridColumnResize,
  GridDragStart,
  GridDrop,
  GridExpandedItemsChanged,
  GridLoadingChanged,
  GridSelectedItemsChanged
} from '@vaadin/vaadin-grid';

import '../../vaadin-grid-pro.js';
import '../../vaadin-grid-pro-edit-column.js';

import { GridProCellEditStarted, GridProItemPropertyChanged } from '../../vaadin-grid-pro.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const grid = document.createElement('vaadin-grid-pro');

/* grid-pro events */
grid.addEventListener('cell-edit-started', (event) => {
  assertType<GridProCellEditStarted>(event);
});

grid.addEventListener('item-property-changed', (event) => {
  assertType<GridProItemPropertyChanged>(event);
});

/* grid events */
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
