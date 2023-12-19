import type { ReactElement, RefAttributes } from 'react';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';
import {
  GridTreeColumnElement,
  GridTreeColumn as _GridTreeColumn,
  type GridTreeColumnProps as _GridTreeColumnProps,
} from './generated/GridTreeColumn.js';

export * from './generated/GridTreeColumn.js';

export type GridTreeColumnProps<TItem> = Partial<
  Omit<
    _GridTreeColumnProps<TItem>,
    'children' | 'footerRenderer' | 'headerRenderer' | 'renderer' | keyof OmittedGridColumnHTMLAttributes<TItem>
  >
>;

export const GridTreeColumn = _GridTreeColumn as <TItem>(
  props: GridTreeColumnProps<TItem> & RefAttributes<GridTreeColumnElement>,
) => ReactElement | null;
