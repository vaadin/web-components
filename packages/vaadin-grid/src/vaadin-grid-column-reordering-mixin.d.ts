import { GridColumnElement } from './vaadin-grid-column.js';

declare function ColumnReorderingMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & ColumnReorderingMixinConstructor;

interface ColumnReorderingMixinConstructor {
  new (...args: any[]): ColumnReorderingMixin;
}

export { ColumnReorderingMixinConstructor };

interface ColumnReorderingMixin {
  /**
   * Set to true to allow column reordering.
   * @attr {boolean} column-reordering-allowed
   */
  columnReorderingAllowed: boolean;

  _getColumnsInOrder(): GridColumnElement[];

  _cellFromPoint(x: number, y: number): HTMLElement | null | undefined;

  _updateGhostPosition(eventClientX: number, eventClientY: number): void;

  _getInnerText(e: Element): string;

  _updateGhost(cell: HTMLElement): HTMLElement;

  _setSiblingsReorderStatus(column: GridColumnElement, status: string): void;

  _autoScroller(): void;

  _isSwapAllowed(
    column1: GridColumnElement | null | undefined,
    column2: GridColumnElement | null | undefined
  ): boolean | undefined;

  _isSwappableByPosition(targetColumn: GridColumnElement, clientX: number): boolean;

  _swapColumnOrders(column1: GridColumnElement, column2: GridColumnElement): void;

  _getTargetColumn(
    targetCell: HTMLElement | null | undefined,
    draggedColumn: GridColumnElement | null
  ): GridColumnElement | null | undefined;
}

export { ColumnReorderingMixin };
