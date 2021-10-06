import { GridColumn } from './vaadin-grid-column.js';
import { Grid } from './vaadin-grid.js';

export type GridBodyRenderer<TItem> = (
  root: HTMLElement,
  column: GridColumn<TItem>,
  model: GridItemModel<TItem>
) => void;

export type GridCellClassNameGenerator<TItem> = (column: GridColumn<TItem>, model: GridItemModel<TItem>) => string;

export type GridColumnTextAlign = 'start' | 'center' | 'end' | null;

export type GridDataProviderCallback<TItem> = (items: Array<TItem>, size?: number) => void;

export type GridDataProviderParams<TItem> = {
  page: number;
  pageSize: number;
  filters: Array<GridFilterDefinition>;
  sortOrders: Array<GridSorterDefinition>;
  parentItem?: TItem;
};

export type GridDataProvider<TItem> = (
  params: GridDataProviderParams<TItem>,
  callback: GridDataProviderCallback<TItem>
) => void;

export type GridDragAndDropFilter<TItem> = (model: GridItemModel<TItem>) => boolean;

export type GridDropLocation = 'above' | 'on-top' | 'below' | 'empty';

export type GridDropMode = 'between' | 'on-top' | 'on-top-or-between' | 'on-grid';

export interface GridFilterDefinition {
  path: string;
  value: string;
}

export interface GridEventContext<TItem> {
  section?: 'body' | 'header' | 'footer' | 'details';
  item?: TItem;
  column?: GridColumn<TItem>;
  index?: number;
  selected?: boolean;
  detailsOpened?: boolean;
  expanded?: boolean;
  level?: number;
}

export type GridHeaderFooterRenderer<TItem> = (root: HTMLElement, column: GridColumn<TItem>) => void;

export type GridDefaultItem = any;

export interface GridItemModel<TItem> {
  index: number;
  item: TItem;
  selected?: boolean;
  expanded?: boolean;
  level?: number;
  detailsOpened?: boolean;
}

export type GridRowDetailsRenderer<TItem> = (
  root: HTMLElement,
  grid?: Grid<TItem>,
  model?: GridItemModel<TItem>
) => void;

export type GridSorterDirection = 'asc' | 'desc' | null;

export interface GridSorterDefinition {
  path: string;
  direction: GridSorterDirection;
}
