import '../../src/vaadin-grid-pro';
import '../../src/vaadin-grid-pro-edit-column';
import { GridColumnElement, GridDropLocation, GridItem, GridItemModel } from '@vaadin/vaadin-grid';

const assert = <T>(value: T) => value;

const grid = document.createElement('vaadin-grid-pro');

/* grid-pro events */
grid.addEventListener('cell-edit-started', (event) => {
  assert<string>(event.detail.value.path);
  assert<number>(event.detail.value.index);
  assert<GridItem>(event.detail.value.item);
});

grid.addEventListener('item-property-changed', (event) => {
  assert<string>(event.detail.value.path);
  assert<number>(event.detail.value.index);
  assert<GridItem>(event.detail.value.item);
  assert<string | boolean>(event.detail.value.value);
});

/* grid events */
grid.addEventListener('active-item-changed', (event) => {
  assert<GridItem>(event.detail.value);
});

grid.addEventListener('cell-activate', (event) => {
  assert<GridItemModel>(event.detail.model);
});

grid.addEventListener('column-reorder', (event) => {
  assert<GridColumnElement[]>(event.detail.columns);
});

grid.addEventListener('column-resize', (event) => {
  assert<GridColumnElement>(event.detail.resizedColumn);
});

grid.addEventListener('loading-changed', (event) => {
  assert<boolean>(event.detail.value);
});

grid.addEventListener('expanded-items-changed', (event) => {
  assert<GridItem[]>(event.detail.value);
});

grid.addEventListener('selected-items-changed', (event) => {
  assert<GridItem[]>(event.detail.value);
});

grid.addEventListener('grid-dragstart', (event) => {
  assert<GridItem[]>(event.detail.draggedItems);
});

grid.addEventListener('grid-drop', (event) => {
  assert<GridItem>(event.detail.dropTargetItem);
  assert<GridDropLocation>(event.detail.dropLocation);
});
