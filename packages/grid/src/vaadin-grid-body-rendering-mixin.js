/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, nothing, render } from 'lit';
import { cache } from 'lit/directives/cache.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { partMap } from '@vaadin/component-base/src/directives/part-map.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { cellContent } from './directives/cell-content-directive.js';

/**
 * A mixin providing rendering of body rows.
 */
export const BodyRenderingMixin = (superClass) =>
  class BodyRenderingMixin extends superClass {
    /** @private */
    __createBodyRow() {
      const renderRoot = document.createDocumentFragment();
      render(this.#bodyRowTemplate({ cells: [] }), renderRoot, { host: this });

      const row = renderRoot.firstElementChild;
      row.__id = generateUniqueId();
      row.__renderRoot = renderRoot;
      return row;
    }

    /** @private */
    __renderBodyRow(row) {
      render(this.#bodyRowTemplate(this.#getRowState(row)), row.__renderRoot, { host: this });

      this.#updateRowCells(row);

      row.querySelectorAll('[role="button"]').forEach((button) => {
        const cell = button.parentElement;
        if (cell._focusButton !== button) {
          // Patch `focus()` to use the button
          cell._focusButton = button;
          cell.focus = (options) => button.focus(options);
        }
      });

      const previousDetailsCell = row.__detailsCell;
      row.__detailsCell = row.querySelector('[part~="details-cell"]');

      if (previousDetailsCell && previousDetailsCell !== row.__detailsCell) {
        this._teardownDetailsCell(previousDetailsCell);
      }

      if (row.__detailsCell && row.__detailsCell !== previousDetailsCell) {
        this._configureDetailsCell(row.__detailsCell);
      }

      if (row.__detailsCell) {
        this.__a11ySetRowDetailsCell(row, row.__detailsCell);
      }
    }

    /** @private */
    __renderSizerRow() {
      const row = this.$.sizer;
      render(this.#sizerRowTemplate(), row, { host: this });

      this.#updateRowCells(row);

      row.__cells.forEach((cell) => {
        cell._column._sizerCell = cell;
      });
    }

    #updateRowCells(row) {
      const columns = this._columnTree.at(-1);
      const previousCells = row.__cells || [];

      [...row.children].forEach((cell) => {
        cell.__parentRow = row;
      });

      row.__cells = [...row.children].filter((cell) => cell._column);

      previousCells
        .filter((cell) => !columns.includes(cell._column))
        .forEach((cell) => {
          const cells = cell._column._cells;
          cells.splice(cells.indexOf(cell), 1);
        });

      row.__cells.forEach((cell) => {
        const column = cell._column;
        column._cells ||= [];
        if (!column._cells.includes(cell)) {
          column._cells.push(cell);
        }
      });
    }

    #getRowState(row) {
      const columns = this._columnTree.at(-1).toSorted((a, b) => a._order - b._order);
      const visibleColumns = columns.filter((column) => !column.hidden);

      return {
        id: row.__id,
        item: this.__getRowItem(row),
        cells: columns.map((column) => {
          return {
            column,
            isFirstCell: column === visibleColumns.at(0),
            isLastCell: column === visibleColumns.at(-1),
            isHidden: column.hidden || column._bodyContentHidden,
          };
        }),
        hasDetailsCell: !!this.rowDetailsRenderer,
      };
    }

    #bodyRowTemplate = ({ id, item, cells, hasDetailsCell }) => {
      return html`
        <tr role="row" tabindex="-1" part="row body-row" class="row body-row" ?loading="${!item}">
          ${repeat(
            cells,
            ({ column }) => column._id,
            ({ column, isFirstCell, isLastCell, isHidden }) => {
              if (isHidden) {
                return cache(nothing);
              }

              const cellParts = {
                'first-column-cell': isFirstCell,
                'last-column-cell': isLastCell,
              };

              return cache(html`
                <td
                  role="${column.rowHeader ? 'rowheader' : 'gridcell'}"
                  part="cell body-cell${partMap(cellParts)}"
                  class="cell body-cell${classMap(cellParts)}"
                  ?first-column="${isFirstCell}"
                  ?last-column="${isLastCell}"
                  tabindex="${column._focusButtonMode ? nothing : '-1'}"
                  @keydown="${this.__onCellKeyDown}"
                  @mousedown=${this.__onCellMouseDown}
                  @mouseenter=${this.__onCellMouseEnter}
                  @mouseleave=${this.__onCellMouseLeave}
                  ._column=${column}
                >
                  ${cellContent(this, `vaadin-grid-body-cell-content-${id}-${column._id}`, {
                    textAlign: column.textAlign,
                    focusButton: column._focusButtonMode,
                  })}
                </td>
              `);
            },
          )}
          ${
            hasDetailsCell
              ? html`
                  <td
                    id="vaadin-grid-details-cell-${id}"
                    role="gridcell"
                    part="cell details-cell"
                    class="cell details-cell"
                    tabindex="-1"
                    frozen
                    @keydown="${this.__onCellKeyDown}"
                    @mousedown=${this.__onCellMouseDown}
                    @mouseenter=${this.__onCellMouseEnter}
                    @mouseleave=${this.__onCellMouseLeave}
                  >
                    ${cellContent(this, `vaadin-grid-details-cell-content-${id}`)}
                  </td>
                `
              : nothing
          }
        </tr>
      `;
    };

    #sizerRowTemplate = () => {
      const columns = this._columnTree.at(-1).toSorted((a, b) => a._order - b._order);

      return html`
        ${repeat(
          columns,
          (column) => column._id,
          (column) => {
            if (column.hidden) {
              return cache(nothing);
            }

            return cache(html`
              <td part="cell body-cell" class="cell body-cell" ._column=${column}>
                ${cellContent(this, `vaadin-grid-sizer-cell-content-${column._id}`)}
              </td>
            `);
          },
        )}
      `;
    };
  };
