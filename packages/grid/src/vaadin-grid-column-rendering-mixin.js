/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, nothing, render } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';
import { cache } from 'lit/directives/cache.js';
import { repeat } from 'lit/directives/repeat.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

/**
 * A directive that manages the `<vaadin-grid-cell-content>` element for a cell.
 */
class CellContentDirective extends AsyncDirective {
  #cell;

  update(part, [grid, slotName]) {
    this.#cell = part.parentNode;
    this.#cell._content ??= document.createElement('vaadin-grid-cell-content');
    this.#cell._content.slot = slotName;

    const { isConnected } = this.#cell._content;
    if (!isConnected) {
      grid.appendChild(this.#cell._content);
    }

    return html`<slot name="${slotName}"></slot>`;
  }

  disconnected() {
    this.#cell._content?.remove();
  }
}

const cellContent = directive(CellContentDirective);

/**
 * A mixin providing rendering of rows based on the column tree.
 */
export const ColumnRenderingMixin = (superClass) =>
  class ColumnRenderingMixin extends superClass {
    /** @private */
    __scheduleRenderHeaderFooter() {
      this.__renderHeaderFooterDebouncer = Debouncer.debounce(this.__renderHeaderFooterDebouncer, microTask, () => {
        this.__renderHeaderFooter();
      });
    }

    /** @private */
    __renderHeaderFooter() {
      this.__renderHeaderFooterDebouncer?.cancel();

      const sortedColumnTree = (this._columnTree ?? []).map((columns) => {
        return columns.toSorted((a, b) => a._order - b._order);
      });

      this.#renderHeader(sortedColumnTree);
      this.#renderFooter(sortedColumnTree);

      this._resetKeyboardNavigation();
      this.__a11yUpdateGridSize(this.size, this._columnTree, this.__emptyState);
    }

    #renderHeader(columnTree) {
      render(
        repeat(columnTree, (columns, level) => this.#renderHeaderRow(columns, level)),
        this.$.header,
        { host: this },
      );

      this.$.table.toggleAttribute('has-header', !!this.$.header.querySelector('tr:not([hidden])'));
      this.__updateHeaderFooterRowParts('header');
    }

    #renderHeaderRow(columns, level) {
      const isRowVisible = this.#isHeaderRowVisible(columns, level);

      return html`
        <tr role="row" part="row header-row" class="row header-row" tabindex="-1" ?hidden=${!isRowVisible}>
          ${repeat(
            columns,
            (column) => column._id,
            (column) => {
              // `cache` keeps the cell and its rendered content when the
              // column gets hidden, so it can be restored as-is when the
              // column is shown again.
              if (column.hidden) {
                return cache(nothing);
              }

              return cache(html`
                <th
                  role="columnheader"
                  part="cell header-cell"
                  class="cell header-cell"
                  @keydown="${this.__onCellKeyDown}"
                  @mousedown=${this.__onCellMouseDown}
                  @mouseenter=${this.__onCellMouseEnter}
                  @mouseleave=${this.__onCellMouseLeave}
                  tabindex="-1"
                  ._column=${column}
                >
                  ${cellContent(this, `vaadin-grid-header-cell-content-${level}-${column._id}`)}
                  ${column.resizable ? html`<div part="resize-handle" class="resize-handle"></div>` : nothing}
                </th>
              `);
            },
          )}
        </tr>
      `;
    }

    #renderFooter(columnTree) {
      render(
        repeat(columnTree.toReversed(), (columns, level) => this.#renderFooterRow(columns, level)),
        this.$.footer,
        { host: this },
      );

      this.$.table.toggleAttribute('has-footer', !!this.$.footer.querySelector('tr:not([hidden])'));
      this.__updateHeaderFooterRowParts('footer');
    }

    #renderFooterRow(columns, level) {
      const isRowVisible = this.#isFooterRowVisible(columns, level);

      return html`
        <tr role="row" part="row footer-row" class="row footer-row" tabindex="-1" ?hidden=${!isRowVisible}>
          ${repeat(
            columns,
            (column) => column._id,
            (column) => {
              // `cache` keeps the cell and its rendered content when the
              // column gets hidden, so it can be restored as-is when the
              // column is shown again.
              if (column.hidden) {
                return cache(nothing);
              }

              return cache(html`
                <td
                  role="gridcell"
                  part="cell footer-cell"
                  class="cell footer-cell"
                  @keydown="${this.__onCellKeyDown}"
                  @mousedown=${this.__onCellMouseDown}
                  @mouseenter=${this.__onCellMouseEnter}
                  @mouseleave=${this.__onCellMouseLeave}
                  tabindex="-1"
                  ._column=${column}
                >
                  ${cellContent(this, `vaadin-grid-footer-cell-content-${level}-${column._id}`)}
                </td>
              `);
            },
          )}
        </tr>
      `;
    }

    #isHeaderRowVisible(columns, level) {
      const isColumnRow = level === this._columnTree.length - 1;

      return columns.some((column) => {
        const isEmptyCell = !isColumnRow && column.localName !== 'vaadin-grid-column-group';
        if (isEmptyCell || column.hidden) {
          return false;
        }

        if (column.header === null) {
          // The column header is explicilty set to null -> row should be hidden
          return false;
        }

        return column.headerRenderer || column.path || column.header !== undefined;
      });
    }

    #isFooterRowVisible(columns, level) {
      // Footer rows are rendered in reverse order, so the column row is the first one
      const isColumnRow = level === 0;

      return columns.some((column) => {
        const isEmptyCell = !isColumnRow && column.localName !== 'vaadin-grid-column-group';
        if (isEmptyCell || column.hidden) {
          return false;
        }

        return column.footerRenderer;
      });
    }
  };
