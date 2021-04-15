import { GridElement } from '@vaadin/vaadin-grid';
import { GridColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-column';
import { InlineEditingMixin } from '../../src/vaadin-grid-pro-inline-editing-mixin';
import { GridProElement } from '../../vaadin-grid-pro';
import { GridProEditColumnElement } from '../../vaadin-grid-pro-edit-column';

interface TestGridItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

/* GridProElement */
const genericGrid = document.createElement('vaadin-grid-pro');
assertType<GridProElement>(genericGrid);

const narrowedGrid = genericGrid as GridProElement<TestGridItem>;
assertType<GridElement<TestGridItem>>(narrowedGrid);
assertType<InlineEditingMixin<TestGridItem>>(narrowedGrid);

narrowedGrid.addEventListener('cell-edit-started', (event) => {
  assertType<string>(event.detail.value.path);
  assertType<number>(event.detail.value.index);
  assertType<TestGridItem>(event.detail.value.item);
});

narrowedGrid.addEventListener('item-property-changed', (event) => {
  assertType<string>(event.detail.value.path);
  assertType<number>(event.detail.value.index);
  assertType<TestGridItem>(event.detail.value.item);
  assertType<string | boolean>(event.detail.value.value);
});

narrowedGrid.addEventListener('active-item-changed', (event) => {
  assertType<GridActiveItemChangedEvent<TestGridItem>>(event);
  assertType<TestGridItem>(event.detail.value);
});

narrowedGrid.addEventListener('cell-activate', (event) => {
  assertType<GridCellActivateEvent<TestGridItem>>(event);
  assertType<GridItemModel<TestGridItem>>(event.detail.model);
});

narrowedGrid.addEventListener('column-reorder', (event) => {
  assertType<GridColumnReorderEvent<TestGridItem>>(event);
  assertType<GridColumnElement<TestGridItem>[]>(event.detail.columns);
});

narrowedGrid.addEventListener('column-resize', (event) => {
  assertType<GridColumnResizeEvent<TestGridItem>>(event);
  assertType<GridColumnElement<TestGridItem>>(event.detail.resizedColumn);
});

narrowedGrid.addEventListener('loading-changed', (event) => {
  assertType<GridLoadingChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedGrid.addEventListener('expanded-items-changed', (event) => {
  assertType<GridExpandedItemsChangedEvent<TestGridItem>>(event);
  assertType<TestGridItem[]>(event.detail.value);
});

narrowedGrid.addEventListener('selected-items-changed', (event) => {
  assertType<GridSelectedItemsChangedEvent<TestGridItem>>(event);
  assertType<TestGridItem[]>(event.detail.value);
});

narrowedGrid.addEventListener('grid-dragstart', (event) => {
  assertType<GridDragStartEvent<TestGridItem>>(event);
  assertType<TestGridItem[]>(event.detail.draggedItems);
});

narrowedGrid.addEventListener('grid-drop', (event) => {
  assertType<GridDropEvent<TestGridItem>>(event);
  assertType<TestGridItem>(event.detail.dropTargetItem);
  assertType<GridDropLocation>(event.detail.dropLocation);
});

/* GridProEditColumnElement */
const genericEditColumn = document.createElement('vaadin-grid-pro-edit-column');
assertType<GridProEditColumnElement>(genericEditColumn);

const narrowedEditColumn = genericEditColumn as GridProEditColumnElement<TestGridItem>;
assertType<GridColumnElement<TestGridItem>>(narrowedEditColumn);
