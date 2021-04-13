import '../../vaadin-grid.js';
import '../../vaadin-grid-filter.js';
import '../../vaadin-grid-selection-column.js';
import '../../vaadin-grid-sorter.js';
import '../../vaadin-grid-sort-column.js';
import '../../vaadin-grid-tree-toggle.js';

import {
  GridColumnElement,
  GridDropLocation,
  GridElement,
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
import { ElementMixin } from '@vaadin/vaadin-element-mixin';
import { ScrollerElement } from "../../src/vaadin-grid-scroller";
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { A11yMixin } from '../../src/vaadin-grid-a11y-mixin';
import { ActiveItemMixin } from '../../src/vaadin-grid-active-item-mixin';
import { ArrayDataProviderMixin } from '../../src/vaadin-grid-array-data-provider-mixin';
import { ColumnReorderingMixin } from '../../src/vaadin-grid-column-reordering-mixin';
import { ColumnResizingMixin } from '../../src/vaadin-grid-column-resizing-mixin';
import { DataProviderMixin } from '../../src/vaadin-grid-data-provider-mixin';
import { DragAndDropMixin } from '../../src/vaadin-grid-drag-and-drop-mixin';
import { DynamicColumnsMixin } from '../../src/vaadin-grid-dynamic-columns-mixin';
import { EventContextMixin } from '../../src/vaadin-grid-event-context-mixin';
import { FilterMixin } from '../../src/vaadin-grid-filter-mixin';
import { KeyboardNavigationMixin } from '../../src/vaadin-grid-keyboard-navigation-mixin';
import { RowDetailsMixin } from '../../src/vaadin-grid-row-details-mixin';
import { ScrollMixin } from '../../src/vaadin-grid-scroll-mixin';
import { SelectionMixin } from '../../src/vaadin-grid-selection-mixin';
import { SortMixin } from '../../src/vaadin-grid-sort-mixin';
import { StylingMixin } from '../../src/vaadin-grid-styling-mixin';

interface TestGridItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

const grid = document.createElement('vaadin-grid') as GridElement<TestGridItem>;

grid.addEventListener('active-item-changed', (event) => {
  assertType<GridActiveItemChangedEvent>(event);
  assertType<TestGridItem>(event.detail.value);
});

grid.addEventListener('cell-activate', (event) => {
  assertType<GridCellActivateEvent>(event);
  assertType<GridItemModel<TestGridItem>>(event.detail.model);
});

grid.addEventListener('column-reorder', (event) => {
  assertType<GridColumnReorderEvent>(event);
  assertType<GridColumnElement<TestGridItem>[]>(event.detail.columns);
});

grid.addEventListener('column-resize', (event) => {
  assertType<GridColumnResizeEvent>(event);
  assertType<GridColumnElement<TestGridItem>>(event.detail.resizedColumn);
});

grid.addEventListener('loading-changed', (event) => {
  assertType<GridLoadingChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

grid.addEventListener('expanded-items-changed', (event) => {
  assertType<GridExpandedItemsChangedEvent>(event);
  assertType<TestGridItem[]>(event.detail.value);
});

grid.addEventListener('selected-items-changed', (event) => {
  assertType<GridSelectedItemsChangedEvent>(event);
  assertType<TestGridItem[]>(event.detail.value);
});

grid.addEventListener('grid-dragstart', (event) => {
  assertType<GridDragStartEvent>(event);
  assertType<TestGridItem[]>(event.detail.draggedItems);
});

grid.addEventListener('grid-drop', (event) => {
  assertType<GridDropEvent>(event);
  assertType<TestGridItem>(event.detail.dropTargetItem);
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

// Verify mixins are correctly extended
assertType<ScrollerElement>(grid);
assertType<ElementMixin>(grid);
assertType<ThemableMixin>(grid);
assertType<A11yMixin>(grid);
assertType<ActiveItemMixin<TestGridItem>>(grid);
assertType<ArrayDataProviderMixin<TestGridItem>>(grid);
assertType<ColumnResizingMixin>(grid);
assertType<DataProviderMixin<TestGridItem>>(grid);
assertType<DynamicColumnsMixin<TestGridItem>>(grid);
assertType<FilterMixin>(grid);
assertType<RowDetailsMixin<TestGridItem>>(grid);
assertType<ScrollMixin>(grid);
assertType<SelectionMixin<TestGridItem>>(grid);
assertType<SortMixin>(grid);
assertType<KeyboardNavigationMixin<TestGridItem>>(grid);
assertType<ColumnReorderingMixin<TestGridItem>>(grid);
assertType<EventContextMixin<TestGridItem>>(grid);
assertType<StylingMixin<TestGridItem>>(grid);
assertType<DragAndDropMixin<TestGridItem>>(grid);
