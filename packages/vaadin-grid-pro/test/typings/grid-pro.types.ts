import {
  GridColumnElement,
  GridDropLocation,
  GridItem,
  GridItemModel,
  GridActiveItemChangedEvent,
  GridCellActivateEvent,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDragStartEvent,
  GridDropEvent,
  GridExpandedItemsChangedEvent,
  GridLoadingChangedEvent,
  GridSelectedItemsChangedEvent
} from '@vaadin/vaadin-grid';

import '../../vaadin-grid-pro.js';
import '../../vaadin-grid-pro-edit-column.js';

import { GridProCellEditStartedEvent, GridProItemPropertyChangedEvent } from '../../vaadin-grid-pro.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const grid = document.createElement('vaadin-grid-pro');

/* grid-pro events */
grid.addEventListener('cell-edit-started', (event) => {
  assertType<GridProCellEditStartedEvent>(event);
  assertType<string>(event.detail.value.path);
  assertType<number>(event.detail.value.index);
  assertType<GridItem>(event.detail.value.item);
});

grid.addEventListener('item-property-changed', (event) => {
  assertType<GridProItemPropertyChangedEvent>(event);
  assertType<string>(event.detail.value.path);
  assertType<number>(event.detail.value.index);
  assertType<GridItem>(event.detail.value.item);
  assertType<string | boolean>(event.detail.value.value);
});

/* grid events */
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
