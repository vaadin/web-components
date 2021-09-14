import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { GridBodyRenderer, GridEventContext } from '../../src/interfaces';
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
import { GridColumnGroupElement } from '../../vaadin-grid-column-group';
import { GridFilterColumnElement } from '../../vaadin-grid-filter-column';
import { GridFilterElement, GridFilterValueChangedEvent } from '../../vaadin-grid-filter.js';
import {
  GridSelectionColumnElement,
  GridSelectionColumnSelectAllChangedEvent
} from '../../vaadin-grid-selection-column.js';
import { GridSortColumnDirectionChangedEvent, GridSortColumnElement } from '../../vaadin-grid-sort-column.js';
import { GridSorterDirectionChangedEvent, GridSorterElement } from '../../vaadin-grid-sorter.js';
import { GridTreeColumnElement } from '../../vaadin-grid-tree-column';
import { GridTreeToggleElement, GridTreeToggleExpandedChangedEvent } from '../../vaadin-grid-tree-toggle.js';
import {
  ColumnBaseMixin,
  GridActiveItemChangedEvent,
  GridCellActivateEvent,
  GridCellFocusEvent,
  GridColumnElement,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDragStartEvent,
  GridDropEvent,
  GridDropLocation,
  GridElement,
  GridExpandedItemsChangedEvent,
  GridItemModel,
  GridLoadingChangedEvent,
  GridSelectedItemsChangedEvent,
  GridSorterDirection
} from '../../vaadin-grid.js';

interface TestGridItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

/* GridElement */
const genericGrid = document.createElement('vaadin-grid');
assertType<GridElement>(genericGrid);

const narrowedGrid = genericGrid as GridElement<TestGridItem>;
assertType<ElementMixin>(narrowedGrid);
assertType<ThemableMixin>(narrowedGrid);
assertType<A11yMixin>(narrowedGrid);
assertType<ActiveItemMixin<TestGridItem>>(narrowedGrid);
assertType<ArrayDataProviderMixin<TestGridItem>>(narrowedGrid);
assertType<ColumnResizingMixin>(narrowedGrid);
assertType<DataProviderMixin<TestGridItem>>(narrowedGrid);
assertType<DynamicColumnsMixin<TestGridItem>>(narrowedGrid);
assertType<FilterMixin>(narrowedGrid);
assertType<RowDetailsMixin<TestGridItem>>(narrowedGrid);
assertType<ScrollMixin>(narrowedGrid);
assertType<SelectionMixin<TestGridItem>>(narrowedGrid);
assertType<SortMixin>(narrowedGrid);
assertType<KeyboardNavigationMixin<TestGridItem>>(narrowedGrid);
assertType<ColumnReorderingMixin<TestGridItem>>(narrowedGrid);
assertType<EventContextMixin<TestGridItem>>(narrowedGrid);
assertType<StylingMixin<TestGridItem>>(narrowedGrid);
assertType<DragAndDropMixin<TestGridItem>>(narrowedGrid);

narrowedGrid.addEventListener('active-item-changed', (event) => {
  assertType<GridActiveItemChangedEvent<TestGridItem>>(event);
  assertType<TestGridItem>(event.detail.value);
});

narrowedGrid.addEventListener('cell-activate', (event) => {
  assertType<GridCellActivateEvent<TestGridItem>>(event);
  assertType<GridItemModel<TestGridItem>>(event.detail.model);
});

narrowedGrid.addEventListener('cell-focus', (event) => {
  assertType<GridCellFocusEvent<TestGridItem>>(event);
  assertType<GridEventContext<TestGridItem>>(event.detail.context);
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

assertType<TestGridItem[]>(narrowedGrid.selectedItems);
assertType<TestGridItem[]>(narrowedGrid.detailsOpenedItems);

/* GridColumnElement */
const genericColumn = document.createElement('vaadin-grid-column');
assertType<GridColumnElement>(genericColumn);

const bodyRenderer: GridBodyRenderer<TestGridItem> = (root, column, model) => {
  assertType<HTMLElement>(root);
  assertType<GridColumnElement>(column);
  assertType<TestGridItem>(model.item);
};
genericColumn.renderer = bodyRenderer;

genericColumn.headerRenderer = (root, column) => {
  assertType<HTMLElement>(root);
  assertType<GridColumnElement>(column);
};

const narrowedColumn = genericColumn as GridColumnElement<TestGridItem>;
assertType<HTMLElement>(narrowedColumn);
assertType<ColumnBaseMixin<TestGridItem>>(narrowedColumn);

/* GridColumnGroupElement */
const genericColumnGroup = document.createElement('vaadin-grid-column-group');
assertType<GridColumnGroupElement>(genericColumnGroup);

const narrowedColumnGroup = genericColumnGroup as GridColumnGroupElement<TestGridItem>;
assertType<HTMLElement>(narrowedColumnGroup);
assertType<ColumnBaseMixin<TestGridItem>>(narrowedColumnGroup);

/* GridFilterElement */
const filter = document.createElement('vaadin-grid-filter');
assertType<GridFilterElement>(filter);
assertType<HTMLElement>(filter);

filter.addEventListener('value-changed', (event) => {
  assertType<GridFilterValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

/* GridFilterColumnElement */
const genericFilterColumn = document.createElement('vaadin-grid-filter-column');
assertType<GridFilterColumnElement>(genericFilterColumn);

const narrowedFilterColumn = genericFilterColumn as GridFilterColumnElement<TestGridItem>;
assertType<GridColumnElement<TestGridItem>>(narrowedFilterColumn);

/* GridSelectionColumnElement */
const genericSelectionColumn = document.createElement('vaadin-grid-selection-column');
assertType<GridSelectionColumnElement>(genericSelectionColumn);

const narrowedSelectionColumn = genericSelectionColumn as GridSelectionColumnElement<TestGridItem>;
assertType<GridColumnElement<TestGridItem>>(narrowedSelectionColumn);

narrowedSelectionColumn.addEventListener('select-all-changed', (event) => {
  assertType<GridSelectionColumnSelectAllChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

/* GridSortColumnElement */
const genericSortColumn = document.createElement('vaadin-grid-sort-column');
assertType<GridSortColumnElement>(genericSortColumn);

const narrowedSortColumn = genericSortColumn as GridSortColumnElement<TestGridItem>;
assertType<GridColumnElement<TestGridItem>>(narrowedSortColumn);

narrowedSortColumn.addEventListener('direction-changed', (event) => {
  assertType<GridSortColumnDirectionChangedEvent>(event);
  assertType<GridSorterDirection>(event.detail.value);
});

/* GridSorterElement */
const sorter = document.createElement('vaadin-grid-sorter');
assertType<GridSorterElement>(sorter);

sorter.addEventListener('direction-changed', (event) => {
  assertType<GridSorterDirectionChangedEvent>(event);
  assertType<GridSorterDirection>(event.detail.value);
});

/* GridTreeColumnElement */
const genericTreeColumn = document.createElement('vaadin-grid-tree-column');
assertType<GridTreeColumnElement>(genericTreeColumn);

const narrowedTreeColumn = genericTreeColumn as GridTreeColumnElement<TestGridItem>;
assertType<GridColumnElement<TestGridItem>>(narrowedTreeColumn);

/* GridTreeToggleElement */
const treeToggle = document.createElement('vaadin-grid-tree-toggle');
assertType<GridTreeToggleElement>(treeToggle);
assertType<ThemableMixin>(treeToggle);

treeToggle.addEventListener('expanded-changed', (event) => {
  assertType<GridTreeToggleExpandedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
