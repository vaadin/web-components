import { GridColumnElement } from './vaadin-grid-column.js';

declare function KeyboardNavigationMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & KeyboardNavigationMixinConstructor;

interface KeyboardNavigationMixinConstructor {
  new (...args: any[]): KeyboardNavigationMixin;
}

interface KeyboardNavigationMixin {
  _itemsFocusable: HTMLElement | undefined;

  _focusedItemIndex: number;

  _onKeyDown(e: KeyboardEvent): void;

  _onFocusIn(e: FocusEvent): void;

  _onFocusOut(e: FocusEvent): void;

  _preventScrollerRotatingCellFocus(row: HTMLTableRowElement, index: number): void;

  _getColumns(rowGroup?: HTMLTableSectionElement | null, rowIndex?: number): GridColumnElement[];

  _resetKeyboardNavigation(): void;

  _scrollHorizontallyToCell(dstCell: HTMLElement): void;
}

export { KeyboardNavigationMixin, KeyboardNavigationMixinConstructor };
