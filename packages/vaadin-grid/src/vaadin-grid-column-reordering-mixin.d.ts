import { GridColumnElement } from './vaadin-grid-column.js';

declare function ColumnReorderingMixin<TItem, T extends new (...args: any[]) => {}>(
  base: T
): T & ColumnReorderingMixinConstructor<TItem>;

interface ColumnReorderingMixinConstructor<TItem> {
  new (...args: any[]): ColumnReorderingMixin<TItem>;
}

export { ColumnReorderingMixinConstructor };

interface ColumnReorderingMixin<TItem> {
  /**
   * Set to true to allow column reordering.
   * @attr {boolean} column-reordering-allowed
   */
  columnReorderingAllowed: boolean;

  _getColumnsInOrder(): GridColumnElement<TItem>[];

  _cellFromPoint(x: number, y: number): HTMLElement | null | undefined;

  _updateGhostPosition(eventClientX: number, eventClientY: number): void;

  _updateGhost(cell: HTMLElement): HTMLElement;

  _setSiblingsReorderStatus(column: GridColumnElement<TItem>, status: string): void;

  _autoScroller(): void;

  _isSwapAllowed(
    column1: GridColumnElement<TItem> | null | undefined,
    column2: GridColumnElement<TItem> | null | undefined
  ): boolean | undefined;

  _isSwappableByPosition(targetColumn: GridColumnElement<TItem>, clientX: number): boolean;

  _swapColumnOrders(column1: GridColumnElement<TItem>, column2: GridColumnElement<TItem>): void;

  _getTargetColumn(
    targetCell: HTMLElement | null | undefined,
    draggedColumn: GridColumnElement<TItem> | null
  ): GridColumnElement<TItem> | null | undefined;
}

export { ColumnReorderingMixin };
