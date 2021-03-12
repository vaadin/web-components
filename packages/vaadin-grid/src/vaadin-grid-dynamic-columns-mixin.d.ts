import { GridColumnGroupElement } from './vaadin-grid-column-group.js';

import { GridColumnElement } from './vaadin-grid-column.js';

declare function DynamicColumnsMixin<T extends new (...args: any[]) => {}>(base: T): T & DynamicColumnsMixinConstructor;

interface DynamicColumnsMixinConstructor {
  new (...args: any[]): DynamicColumnsMixin;
}

interface DynamicColumnsMixin {
  _getChildColumns(el: GridColumnGroupElement): GridColumnElement[];

  _updateColumnTree(): void;

  _checkImports(): void;

  _updateFirstAndLastColumn(): void;

  _updateFirstAndLastColumnForRow(row: HTMLElement): void;

  _isColumnElement(node: Node): boolean;
}

export { DynamicColumnsMixin, DynamicColumnsMixinConstructor };
