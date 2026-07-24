/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, nothing, render } from 'lit';
import { cache } from 'lit/directives/cache.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { partMap } from '@vaadin/component-base/src/directives/part-map.js';
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
 * A mixin providing rendering of header and footer rows based on the column tree.
 */
export const HeaderFooterRenderingMixin = (superClass) =>
  class HeaderFooterRenderingMixin extends superClass {
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

      sortedColumnTree.flat().forEach((column) => {
        column._emptyCells = [];
      });

      this.#renderHeader(sortedColumnTree);
      this.#renderFooter(sortedColumnTree);

      this._resetKeyboardNavigation();
      this.__a11yUpdateGridSize(this.size, this._columnTree, this.__emptyState);
    }

    #renderHeader(columnTree) {
      const rows = this.#getRows(columnTree, 'header');
      render(rows.map(this.#renderHeaderRow), this.$.header, { host: this });

      this.$.table.toggleAttribute('has-header', !!this.$.header.querySelector('tr:not([hidden])'));

      this.$.header.querySelectorAll('.header-cell').forEach((cell) => {
        const column = cell._column;
        const isColumnRow = cell.parentElement === this.$.header.lastElementChild;
        if (isColumnRow || column.localName === 'vaadin-grid-column-group') {
          column._headerCell = cell;
        } else {
          column._emptyCells.push(cell);
        }
      });
    }

    #renderHeaderRow = ({ level, cells, isLast: isLastRow, isFirst: isFirstRow, isVisible: isRowVisible }) => {
      const rowParts = {
        'first-header-row': isFirstRow,
        'last-header-row': isLastRow,
      };

      return html`
        <tr
          role="row"
          part="row header-row ${partMap(rowParts)}"
          class="row header-row ${classMap(rowParts)}"
          tabindex="-1"
          ?hidden=${!isRowVisible}
        >
          ${repeat(
            cells,
            ({ column }) => column._id,
            ({ column, isFirst: isFirstCell, isLast: isLastCell }) => {
              // `cache` keeps the cell and its rendered content when the
              // column gets hidden, so it can be restored as-is when the
              // column is shown again.
              if (column.hidden) {
                return cache(nothing);
              }

              const cellParts = {
                'first-header-row-cell': isFirstRow,
                'last-header-row-cell': isLastRow,
                'first-column-cell': isFirstCell,
                'last-column-cell': isLastCell,
              };

              return cache(html`
                <th
                  role="columnheader"
                  part="cell header-cell ${partMap(cellParts)}"
                  class="cell header-cell ${classMap(cellParts)}"
                  @keydown="${this.__onCellKeyDown}"
                  @mousedown=${this.__onCellMouseDown}
                  @mouseenter=${this.__onCellMouseEnter}
                  @mouseleave=${this.__onCellMouseLeave}
                  ?first-column="${isFirstCell}"
                  ?last-column="${isLastCell}"
                  colspan="${ifDefined(column._colSpan)}"
                  aria-colspan="${ifDefined(column._colSpan)}"
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
      const rows = this.#getRows(columnTree, 'footer');
      render(rows.map(this.#renderFooterRow), this.$.footer, { host: this });

      this.$.table.toggleAttribute('has-footer', !!this.$.footer.querySelector('tr:not([hidden])'));

      this.$.footer.querySelectorAll('.footer-cell').forEach((cell) => {
        const column = cell._column;
        const isColumnRow = cell.parentElement === this.$.footer.firstElementChild;
        if (isColumnRow || column.localName === 'vaadin-grid-column-group') {
          column._footerCell = cell;
        } else {
          column._emptyCells.push(cell);
        }
      });
    }

    #renderFooterRow = ({ level, cells, isLast: isLastRow, isFirst: isFirstRow, isVisible: isRowVisible }) => {
      const rowParts = {
        'first-footer-row': isFirstRow,
        'last-footer-row': isLastRow,
      };

      return html`
        <tr
          role="row"
          part="row footer-row ${partMap(rowParts)}"
          class="row footer-row ${classMap(rowParts)}"
          tabindex="-1"
          ?hidden=${!isRowVisible}
        >
          ${repeat(
            cells,
            ({ column }) => column._id,
            ({ column, isFirst: isFirstCell, isLast: isLastCell }) => {
              // `cache` keeps the cell and its rendered content when the
              // column gets hidden, so it can be restored as-is when the
              // column is shown again.
              if (column.hidden) {
                return cache(nothing);
              }

              const cellParts = {
                'first-footer-row-cell': isFirstRow,
                'last-footer-row-cell': isLastRow,
                'first-column-cell': isFirstCell,
                'last-column-cell': isLastCell,
              };

              return cache(html`
                <td
                  role="gridcell"
                  part="cell footer-cell ${partMap(cellParts)}"
                  class="cell footer-cell ${classMap(cellParts)}"
                  ?first-column="${isFirstCell}"
                  ?last-column="${isLastCell}"
                  @keydown="${this.__onCellKeyDown}"
                  @mousedown=${this.__onCellMouseDown}
                  @mouseenter=${this.__onCellMouseEnter}
                  @mouseleave=${this.__onCellMouseLeave}
                  colspan="${ifDefined(column._colSpan)}"
                  aria-colspan="${ifDefined(column._colSpan)}"
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

    #getRows(columnTree, section) {
      let rows = columnTree.map((columns, level) => {
        return {
          level,
          cells: columns.map((column, index) => {
            return {
              column,
              isFirst: index === 0,
              isLast: index === columns.length - 1,
            };
          }),
          isVisible:
            section === 'header'
              ? isHeaderRowVisible(columns, level, columnTree)
              : isFooterRowVisible(columns, level, columnTree),
        };
      });

      if (section === 'footer') {
        rows = rows.toReversed();
      }

      const visibleRows = rows.filter((row) => row.isVisible);

      return rows.map((row) => {
        return {
          ...row,
          isFirst: row === visibleRows.at(0),
          isLast: row === visibleRows.at(-1),
        };
      });
    }
  };
