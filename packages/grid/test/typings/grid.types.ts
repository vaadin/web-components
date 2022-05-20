import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin';
import { ActiveItemMixinClass } from '../../src/vaadin-grid-active-item-mixin';
import { ArrayDataProviderMixinClass } from '../../src/vaadin-grid-array-data-provider-mixin';
import { ColumnReorderingMixinClass } from '../../src/vaadin-grid-column-reordering-mixin';
import { DataProviderMixinClass } from '../../src/vaadin-grid-data-provider-mixin';
import { DragAndDropMixinClass } from '../../src/vaadin-grid-drag-and-drop-mixin';
import { EventContextMixinClass } from '../../src/vaadin-grid-event-context-mixin';
import { RowDetailsMixinClass } from '../../src/vaadin-grid-row-details-mixin';
import { ScrollMixinClass } from '../../src/vaadin-grid-scroll-mixin';
import { SelectionMixinClass } from '../../src/vaadin-grid-selection-mixin';
import { SortMixinClass } from '../../src/vaadin-grid-sort-mixin';
import { StylingMixinClass } from '../../src/vaadin-grid-styling-mixin';
import {
  ColumnBaseMixinClass,
  Grid,
  GridActiveItemChangedEvent,
  GridBodyRenderer,
  GridCellActivateEvent,
  GridCellClassNameGenerator,
  GridCellFocusEvent,
  GridColumn,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridColumnTextAlign,
  GridDataProviderCallback,
  GridDragAndDropFilter,
  GridDragStartEvent,
  GridDropEvent,
  GridDropLocation,
  GridDropMode,
  GridEventContext,
  GridExpandedItemsChangedEvent,
  GridFilterDefinition,
  GridItemModel,
  GridLoadingChangedEvent,
  GridRowDetailsRenderer,
  GridSelectedItemsChangedEvent,
  GridSorterDefinition,
  GridSorterDirection,
} from '../../vaadin-grid.js';
import { GridColumnGroup } from '../../vaadin-grid-column-group';
import { GridFilter, GridFilterValueChangedEvent } from '../../vaadin-grid-filter.js';
import { GridFilterColumn } from '../../vaadin-grid-filter-column';
import { GridSelectionColumn, GridSelectionColumnSelectAllChangedEvent } from '../../vaadin-grid-selection-column.js';
import { GridSortColumn, GridSortColumnDirectionChangedEvent } from '../../vaadin-grid-sort-column.js';
import { GridSorter, GridSorterDirectionChangedEvent } from '../../vaadin-grid-sorter.js';
import { GridTreeColumn } from '../../vaadin-grid-tree-column';
import { GridTreeToggle, GridTreeToggleExpandedChangedEvent } from '../../vaadin-grid-tree-toggle.js';

interface TestGridItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

/* Grid */
const genericGrid = document.createElement('vaadin-grid');
assertType<Grid>(genericGrid);

const narrowedGrid = genericGrid as Grid<TestGridItem>;
assertType<DisabledMixinClass>(narrowedGrid);
assertType<ElementMixinClass>(narrowedGrid);
assertType<ThemableMixinClass>(narrowedGrid);
assertType<ActiveItemMixinClass<TestGridItem>>(narrowedGrid);
assertType<ArrayDataProviderMixinClass<TestGridItem>>(narrowedGrid);
assertType<DataProviderMixinClass<TestGridItem>>(narrowedGrid);
assertType<RowDetailsMixinClass<TestGridItem>>(narrowedGrid);
assertType<ScrollMixinClass>(narrowedGrid);
assertType<SelectionMixinClass<TestGridItem>>(narrowedGrid);
assertType<SortMixinClass>(narrowedGrid);
assertType<ColumnReorderingMixinClass>(narrowedGrid);
assertType<EventContextMixinClass<TestGridItem>>(narrowedGrid);
assertType<StylingMixinClass<TestGridItem>>(narrowedGrid);
assertType<DragAndDropMixinClass<TestGridItem>>(narrowedGrid);

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

narrowedGrid.dataProvider = (params, callback) => {
  assertType<GridFilterDefinition[]>(params.filters);
  assertType<number>(params.page);
  assertType<number>(params.pageSize);
  assertType<TestGridItem | undefined>(params.parentItem);
  assertType<GridSorterDefinition[]>(params.sortOrders);
  assertType<GridDataProviderCallback<TestGridItem>>(callback);
};

assertType<boolean>(narrowedGrid.disabled);

assertType<number>(narrowedGrid.pageSize);
assertType<number>(narrowedGrid.size);
assertType<boolean | null | undefined>(narrowedGrid.loading);
assertType<string | null | undefined>(narrowedGrid.itemIdPath);
assertType<string>(narrowedGrid.itemHasChildrenPath);

assertType<TestGridItem[] | undefined | null>(narrowedGrid.items);
assertType<TestGridItem | null>(narrowedGrid.activeItem);
assertType<boolean>(narrowedGrid.columnReorderingAllowed);

assertType<TestGridItem[]>(narrowedGrid.selectedItems);
assertType<TestGridItem[]>(narrowedGrid.detailsOpenedItems);
assertType<TestGridItem[]>(narrowedGrid.expandedItems);

assertType<(arg0: TestGridItem) => TestGridItem | unknown>(narrowedGrid.getItemId);
assertType<(arg0: TestGridItem) => void>(narrowedGrid.expandItem);
assertType<(arg0: TestGridItem) => void>(narrowedGrid.collapseItem);
assertType<() => void>(narrowedGrid.clearCache);

assertType<GridDropMode | null | undefined>(narrowedGrid.dropMode);
assertType<boolean | null | undefined>(narrowedGrid.rowsDraggable);
assertType<GridDragAndDropFilter<TestGridItem> | null | undefined>(narrowedGrid.dragFilter);
assertType<GridDragAndDropFilter<TestGridItem> | null | undefined>(narrowedGrid.dropFilter);
assertType<() => void>(narrowedGrid.filterDragAndDrop);

assertType<(arg0: Event) => GridEventContext<TestGridItem>>(narrowedGrid.getEventContext);

assertType<GridRowDetailsRenderer<TestGridItem> | null | undefined>(narrowedGrid.rowDetailsRenderer);
assertType<(arg0: TestGridItem) => void>(narrowedGrid.openItemDetails);
assertType<(arg0: TestGridItem) => void>(narrowedGrid.closeItemDetails);
assertType<(arg0: number) => void>(narrowedGrid.scrollToIndex);

assertType<(arg0: TestGridItem) => void>(narrowedGrid.selectItem);
assertType<(arg0: TestGridItem) => void>(narrowedGrid.deselectItem);

assertType<boolean>(narrowedGrid.multiSort);

assertType<GridCellClassNameGenerator<TestGridItem> | null | undefined>(narrowedGrid.cellClassNameGenerator);
assertType<() => void>(narrowedGrid.generateCellClassNames);

assertType<boolean>(narrowedGrid.allRowsVisible);
assertType<() => void>(narrowedGrid.recalculateColumnWidths);
assertType<() => void>(narrowedGrid.requestContentUpdate);

/* GridColumn */
const genericColumn = document.createElement('vaadin-grid-column');
assertType<GridColumn>(genericColumn);

const bodyRenderer: GridBodyRenderer<TestGridItem> = (root, column, model) => {
  assertType<HTMLElement>(root);
  assertType<GridColumn>(column);
  assertType<TestGridItem>(model.item);
};
genericColumn.renderer = bodyRenderer;

genericColumn.headerRenderer = (root, column) => {
  assertType<HTMLElement>(root);
  assertType<GridColumn>(column);
};

genericColumn.footerRenderer = (root, column) => {
  assertType<HTMLElement>(root);
  assertType<GridColumn>(column);
};

const narrowedColumn = genericColumn as GridColumn<TestGridItem>;
assertType<HTMLElement>(narrowedColumn);
assertType<ColumnBaseMixinClass<TestGridItem>>(narrowedColumn);

assertType<number | null | undefined>(narrowedColumn.flexGrow);
assertType<string | null | undefined>(narrowedColumn.width);
assertType<boolean | null | undefined>(narrowedColumn.resizable);
assertType<boolean>(narrowedColumn.frozen);
assertType<boolean>(narrowedColumn.frozenToEnd);
assertType<boolean>(narrowedColumn.hidden);
assertType<string | null | undefined>(narrowedColumn.header);
assertType<GridColumnTextAlign | null | undefined>(narrowedColumn.textAlign);
assertType<string | null | undefined>(narrowedColumn.path);
assertType<boolean>(narrowedColumn.autoWidth);

/* GridColumnGroup */
const genericColumnGroup = document.createElement('vaadin-grid-column-group');
assertType<GridColumnGroup>(genericColumnGroup);

const narrowedColumnGroup = genericColumnGroup as GridColumnGroup<TestGridItem>;
assertType<HTMLElement>(narrowedColumnGroup);
assertType<ColumnBaseMixinClass<TestGridItem>>(narrowedColumnGroup);

/* GridFilter */
const filter = document.createElement('vaadin-grid-filter');
assertType<GridFilter>(filter);
assertType<HTMLElement>(filter);
assertType<string | null | undefined>(filter.path);
assertType<string | null | undefined>(filter.value);

filter.addEventListener('value-changed', (event) => {
  assertType<GridFilterValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

/* GridFilterColumn */
const genericFilterColumn = document.createElement('vaadin-grid-filter-column');
assertType<GridFilterColumn>(genericFilterColumn);

const narrowedFilterColumn = genericFilterColumn as GridFilterColumn<TestGridItem>;
assertType<GridColumn<TestGridItem>>(narrowedFilterColumn);
assertType<string | null | undefined>(narrowedFilterColumn.header);
assertType<string | null | undefined>(narrowedFilterColumn.path);

/* GridSelectionColumn */
const genericSelectionColumn = document.createElement('vaadin-grid-selection-column');
assertType<GridSelectionColumn>(genericSelectionColumn);

const narrowedSelectionColumn = genericSelectionColumn as GridSelectionColumn<TestGridItem>;
assertType<GridColumn<TestGridItem>>(narrowedSelectionColumn);

narrowedSelectionColumn.addEventListener('select-all-changed', (event) => {
  assertType<GridSelectionColumnSelectAllChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

assertType<string | null | undefined>(narrowedSelectionColumn.width);
assertType<number>(narrowedSelectionColumn.flexGrow);
assertType<boolean>(narrowedSelectionColumn.selectAll);
assertType<boolean>(narrowedSelectionColumn.autoSelect);

/* GridSortColumn */
const genericSortColumn = document.createElement('vaadin-grid-sort-column');
assertType<GridSortColumn>(genericSortColumn);

const narrowedSortColumn = genericSortColumn as GridSortColumn<TestGridItem>;
assertType<GridColumn<TestGridItem>>(narrowedSortColumn);
assertType<string | null | undefined>(narrowedSortColumn.path);
assertType<GridSorterDirection | null | undefined>(narrowedSortColumn.direction);

narrowedSortColumn.addEventListener('direction-changed', (event) => {
  assertType<GridSortColumnDirectionChangedEvent>(event);
  assertType<GridSorterDirection>(event.detail.value);
});

/* GridSorter */
const sorter = document.createElement('vaadin-grid-sorter');
assertType<GridSorter>(sorter);

sorter.addEventListener('direction-changed', (event) => {
  assertType<GridSorterDirectionChangedEvent>(event);
  assertType<GridSorterDirection>(event.detail.value);
});

assertType<string | null | undefined>(sorter.path);
assertType<GridSorterDirection | null | undefined>(sorter.direction);

/* GridTreeColumn */
const genericTreeColumn = document.createElement('vaadin-grid-tree-column');
assertType<GridTreeColumn>(genericTreeColumn);

const narrowedTreeColumn = genericTreeColumn as GridTreeColumn<TestGridItem>;
assertType<GridColumn<TestGridItem>>(narrowedTreeColumn);
assertType<string | null | undefined>(narrowedTreeColumn.path);
assertType<string | null | undefined>(narrowedTreeColumn.itemHasChildrenPath);

/* GridTreeToggle */
const treeToggle = document.createElement('vaadin-grid-tree-toggle');
assertType<GridTreeToggle>(treeToggle);
assertType<ThemableMixinClass>(treeToggle);
assertType<number>(treeToggle.level);
assertType<boolean>(treeToggle.leaf);
assertType<boolean>(treeToggle.expanded);

treeToggle.addEventListener('expanded-changed', (event) => {
  assertType<GridTreeToggleExpandedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
