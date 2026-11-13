/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { nothing } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';

/**
 * A directive that observes the size of a details cell while it is rendered.
 */
class DetailsCellDirective extends AsyncDirective {
  #grid;
  #cell;

  update(part, [grid]) {
    if (!this.#cell) {
      this.#grid = grid;
      this.#cell = part.element;
      this.#grid._detailsCellResizeObserver.observe(this.#cell);
      this.#grid._frozenCellsChanged();
    }
    return nothing;
  }

  disconnected() {
    this.#grid._detailsCellResizeObserver.unobserve(this.#cell);
    this.#grid._frozenCellsChanged();
  }
}

export const detailsCell = directive(DetailsCellDirective);
