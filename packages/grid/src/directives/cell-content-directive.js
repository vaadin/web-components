/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';

/**
 * A directive that manages the `<vaadin-grid-cell-content>` element for a cell.
 */
class CellContentDirective extends AsyncDirective {
  #cell;

  update(part, [grid, slotName]) {
    this.#cell = part.parentNode;
    this.#cell._content ??= document.createElement('vaadin-grid-cell-content');
    this.#cell._content.slot = slotName;

    if (!grid.contains(this.#cell._content)) {
      grid.appendChild(this.#cell._content);
    }

    return html`<slot name="${slotName}"></slot>`;
  }

  disconnected() {
    this.#cell._content?.remove();
  }
}

export const cellContent = directive(CellContentDirective);
