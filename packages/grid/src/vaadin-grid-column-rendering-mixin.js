/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, nothing, render } from 'lit';
import { cache } from 'lit/directives/cache.js';
import { repeat } from 'lit/directives/repeat.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { cellContent } from './directives/cell-content-directive.js';

function isEmptyCell(column, level, columnTree) {
  const isColumnRow = level === columnTree.length - 1;
  return !isColumnRow && column.localName !== 'vaadin-grid-column-group';
}

function isHeaderRowVisible(columns, level, columnTree) {
  return columns.some((column) => {
    if (column.hidden || isEmptyCell(column, level, columnTree)) {
      return false;
    }

    if (column.headerRenderer) {
      // The column has a header renderer -> row should be visible
      return true;
    }

    if (column.header === null) {
      // The column header is explicitly set to null -> doesn't block hiding the row
      return false;
    }

    return column.path || column.header !== undefined;
  });
}

function isFooterRowVisible(columns, level, columnTree) {
  return columns.some((column) => {
    if (column.hidden || isEmptyCell(column, level, columnTree)) {
      return false;
    }

    return column.footerRenderer;
  });
}

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
      render(columnTree.map(this.#renderHeaderRow), this.$.header, { host: this });

      this.$.table.toggleAttribute('has-header', !!this.$.header.querySelector('tr:not([hidden])'));
      this.__updateHeaderFooterRowParts('header');
    }

    #renderHeaderRow = (columns, level, columnTree) => {
      return html`
        <tr
          role="row"
          part="row header-row"
          class="row header-row"
          tabindex="-1"
          ?hidden=${!isHeaderRowVisible(columns, level, columnTree)}
        >
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
    };

    #renderFooter(columnTree) {
      render(columnTree.map(this.#renderFooterRow).toReversed(), this.$.footer, { host: this });

      this.$.table.toggleAttribute('has-footer', !!this.$.footer.querySelector('tr:not([hidden])'));
      this.__updateHeaderFooterRowParts('footer');
    }

    #renderFooterRow = (columns, level, columnTree) => {
      return html`
        <tr
          role="row"
          part="row footer-row"
          class="row footer-row"
          tabindex="-1"
          ?hidden=${!isFooterRowVisible(columns, level, columnTree)}
        >
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
    };
  };
