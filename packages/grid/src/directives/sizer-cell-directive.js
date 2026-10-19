/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { nothing } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';

/**
 * A directive that keeps a sizer cell registered as the sizer cell of its column
 * for as long as the cell is rendered.
 */
class SizerCellDirective extends AsyncDirective {
  #cell;

  update(part, [column]) {
    if (!this.#cell) {
      this.#cell = part.element;
      this.#cell._column = column;
      column._cells = [...(column._cells ?? []), this.#cell];
      column._sizerCell = this.#cell;
    }
    return nothing;
  }

  disconnected() {
    const column = this.#cell._column;
    column._cells = column._cells.filter((cell) => cell !== this.#cell);
    column._sizerCell = null;
  }
}

export const sizerCell = directive(SizerCellDirective);
