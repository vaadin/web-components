/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { nothing } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';

/**
 * A directive that keeps a body cell registered in its column
 * for as long as the column is part of the grid.
 */
export class BodyCellDirective extends AsyncDirective {
  #grid;
  #cell;

  update(part, [grid, column]) {
    if (!this.#cell) {
      this.#grid = grid;
      this.#cell = part.element;
      this.#cell._column = column;
      this.register(column, this.#cell);
    }
    return nothing;
  }

  disconnected() {
    const column = this.#cell._column;
    if (!this.#grid._columnTree.at(-1).includes(column)) {
      this.unregister(column, this.#cell);
    }
  }

  register(column, cell) {
    column._cells = [...(column._cells ?? []), cell];
  }

  unregister(column, cell) {
    column._cells = column._cells.filter((c) => c !== cell);
  }
}

export const bodyCell = directive(BodyCellDirective);
