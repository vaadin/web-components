import {
  GridColumnElement,
  GridDropLocation,
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

import '../../vaadin-grid-pro-edit-column.js';

import { GridProElement, GridProCellEditStartedEvent, GridProItemPropertyChangedEvent } from '../../vaadin-grid-pro.js';

interface TestGridItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

const grid = document.createElement('vaadin-grid-pro') as GridProElement<TestGridItem>;

/* grid-pro events */
grid.addEventListener('cell-edit-started', (event) => {
  assertType<GridProCellEditStartedEvent<TestGridItem>>(event);
  assertType<string>(event.detail.value.path);
  assertType<number>(event.detail.value.index);
  assertType<TestGridItem>(event.detail.value.item);
});

grid.addEventListener('item-property-changed', (event) => {
  assertType<GridProItemPropertyChangedEvent<TestGridItem>>(event);
  assertType<string>(event.detail.value.path);
  assertType<number>(event.detail.value.index);
  assertType<TestGridItem>(event.detail.value.item);
  assertType<string | boolean>(event.detail.value.value);
});

/* grid events */
grid.addEventListener('active-item-changed', (event) => {
  assertType<GridActiveItemChangedEvent<TestGridItem>>(event);
  assertType<TestGridItem>(event.detail.value);
});

grid.addEventListener('cell-activate', (event) => {
  assertType<GridCellActivateEvent<TestGridItem>>(event);
  assertType<GridItemModel<TestGridItem>>(event.detail.model);
});

grid.addEventListener('column-reorder', (event) => {
  assertType<GridColumnReorderEvent<TestGridItem>>(event);
  assertType<GridColumnElement<TestGridItem>[]>(event.detail.columns);
});

grid.addEventListener('column-resize', (event) => {
  assertType<GridColumnResizeEvent<TestGridItem>>(event);
  assertType<GridColumnElement<TestGridItem>>(event.detail.resizedColumn);
});

grid.addEventListener('loading-changed', (event) => {
  assertType<GridLoadingChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

grid.addEventListener('expanded-items-changed', (event) => {
  assertType<GridExpandedItemsChangedEvent<TestGridItem>>(event);
  assertType<TestGridItem[]>(event.detail.value);
});

grid.addEventListener('selected-items-changed', (event) => {
  assertType<GridSelectedItemsChangedEvent<TestGridItem>>(event);
  assertType<TestGridItem[]>(event.detail.value);
});

grid.addEventListener('grid-dragstart', (event) => {
  assertType<GridDragStartEvent<TestGridItem>>(event);
  assertType<TestGridItem[]>(event.detail.draggedItems);
});

grid.addEventListener('grid-drop', (event) => {
  assertType<GridDropEvent<TestGridItem>>(event);
  assertType<TestGridItem>(event.detail.dropTargetItem);
  assertType<GridDropLocation>(event.detail.dropLocation);
});

assertType<GridElement<TestGridItem>>(grid);
assertType<InlineEditingMixin<TestGridItem>>(grid);
