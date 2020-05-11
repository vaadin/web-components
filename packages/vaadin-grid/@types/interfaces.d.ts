import { GridColumnElement } from '../src/vaadin-grid-column.js';
import { GridElement } from '../src/vaadin-grid.js';

export type GridBodyRenderer = (
  root: HTMLElement,
  column: GridColumnElement,
  rowData: GridRowData
) => void;

export type GridCellClassNameGenerator = (
  column: GridColumnElement,
  rowData: GridRowData
) => void;

export type GridColumnTextAlign = 'start' | 'center' | 'end' | null;

export type GridDataProviderCallback = (
  items: Array<GridItem>,
  size?: number
) => void;

export type GridDataProviderParams = {
  page: number;
  pageSize: number;
  filters: Array<GridFilter>;
  sortOrders: Array<GridSorter>;
  parentItem?: GridItem;
};

export type GridDataProvider = (
  params: GridDataProviderParams,
  callback: GridDataProviderCallback
) => void;

export type GridDragAndDropFilter = (rowData: GridRowData) => void;

export type GridDropMode = 'between' | 'on-top' | 'on-top-or-between' | 'on-grid';

export interface GridFilter {
  path: string;
  value: string;
}

export interface GridEventContext {
  section: 'body' | 'header' | 'footer' | 'details';
  item?: GridItem;
  column?: GridColumnElement;
  index?: number;
  selected?: boolean;
  detailsOpened?: boolean;
  expanded?: boolean;
  level?: number;
}

export type GridHeaderFooterRenderer = (
  root: HTMLElement,
  column: GridColumnElement
) => void;

export type GridItem = string | { [key: string]: unknown };

export interface GridRowData {
  index: number;
  item: GridItem;
  selected?: boolean;
  expanded?: boolean;
  level?: number;
  detailsOpened?: boolean;
}

export type GridRowDetailsRenderer = (
  root: HTMLElement,
  grid: GridElement,
  rowData: GridRowData
) => void;

export type GridSorterDirection = 'asc' | 'desc' | null;

export interface GridSorter {
  path: string;
  direction: GridSorterDirection;
}
