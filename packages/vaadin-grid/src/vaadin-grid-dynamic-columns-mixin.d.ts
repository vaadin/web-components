import { GridColumnGroupElement } from './vaadin-grid-column-group.js';

import { GridColumnElement } from './vaadin-grid-column.js';

declare function DynamicColumnsMixin<TItem, T extends new (...args: any[]) => {}>(
  base: T
): T & DynamicColumnsMixinConstructor<TItem>;

interface DynamicColumnsMixinConstructor<TItem> {
  new (...args: any[]): DynamicColumnsMixin<TItem>;
}

interface DynamicColumnsMixin<TItem> {
  _getChildColumns(el: GridColumnGroupElement<TItem>): GridColumnElement<TItem>[];

  _updateColumnTree(): void;

  _checkImports(): void;

  _updateFirstAndLastColumn(): void;

  _updateFirstAndLastColumnForRow(row: HTMLElement): void;

  _isColumnElement(node: Node): boolean;
}

export { DynamicColumnsMixin, DynamicColumnsMixinConstructor };
