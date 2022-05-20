import {
  Grid,
  GridActiveItemChangedEvent,
  GridCellActivateEvent,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDragStartEvent,
  GridDropEvent,
  GridDropLocation,
  GridExpandedItemsChangedEvent,
  GridItemModel,
  GridLoadingChangedEvent,
  GridSelectedItemsChangedEvent,
} from '@vaadin/grid';
import { GridColumn } from '@vaadin/grid/vaadin-grid-column';
import { InlineEditingMixinClass } from '../../src/vaadin-grid-pro-inline-editing-mixin';
import { GridPro } from '../../vaadin-grid-pro';
import { GridProEditColumn } from '../../vaadin-grid-pro-edit-column';

interface TestGridItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

/* GridPro */
const genericGrid = document.createElement('vaadin-grid-pro');
assertType<GridPro>(genericGrid);

const narrowedGrid = genericGrid as GridPro<TestGridItem>;
assertType<Grid<TestGridItem>>(narrowedGrid);
assertType<InlineEditingMixinClass>(narrowedGrid);

narrowedGrid.addEventListener('cell-edit-started', (event) => {
  assertType<string>(event.detail.path);
  assertType<number>(event.detail.index);
  assertType<TestGridItem>(event.detail.item);
});

narrowedGrid.addEventListener('item-property-changed', (event) => {
  assertType<string>(event.detail.path);
  assertType<number>(event.detail.index);
  assertType<TestGridItem>(event.detail.item);
  assertType<string | boolean>(event.detail.value);
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
  assertType<Array<GridColumn<TestGridItem>>>(event.detail.columns);
});

narrowedGrid.addEventListener('column-resize', (event) => {
  assertType<GridColumnResizeEvent<TestGridItem>>(event);
  assertType<GridColumn<TestGridItem>>(event.detail.resizedColumn);
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

/* GridProEditColumn */
const genericEditColumn = document.createElement('vaadin-grid-pro-edit-column');
assertType<GridProEditColumn>(genericEditColumn);

const narrowedEditColumn = genericEditColumn as GridProEditColumn<TestGridItem>;
assertType<GridColumn<TestGridItem>>(narrowedEditColumn);
