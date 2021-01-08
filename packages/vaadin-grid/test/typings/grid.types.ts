import '../../src/vaadin-grid';
import '../../src/vaadin-grid-filter';
import '../../src/vaadin-grid-selection-column';
import '../../src/vaadin-grid-sorter';
import '../../src/vaadin-grid-sort-column';
import '../../src/vaadin-grid-tree-toggle';
import { GridColumnElement, GridDropLocation, GridItem, GridItemModel, GridSorterDirection } from '../../src/interfaces';

const assert = <T>(value: T) => value;

const grid = document.createElement('vaadin-grid');

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

const filter = document.createElement('vaadin-grid-filter');

filter.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});

const selectionColumn = document.createElement('vaadin-grid-selection-column');

selectionColumn.addEventListener('select-all-changed', (event) => {
  assert<boolean>(event.detail.value);
});

const sorter = document.createElement('vaadin-grid-sorter');

sorter.addEventListener('direction-changed', (event) => {
  assert<GridSorterDirection>(event.detail.value);
});

const sortColumn = document.createElement('vaadin-grid-sort-column');

sortColumn.addEventListener('direction-changed', (event) => {
  assert<GridSorterDirection>(event.detail.value);
});

const treeToggle = document.createElement('vaadin-grid-tree-toggle');

treeToggle.addEventListener('expanded-changed', (event) => {
  assert<boolean>(event.detail.value);
});
