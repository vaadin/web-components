/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, nothing, render } from 'lit';
import { cache } from 'lit/directives/cache.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { partMap } from '@vaadin/component-base/src/directives/part-map.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { bodyCell } from './directives/body-cell-directive.js';
import { bodyRow } from './directives/body-row-directive.js';
import { cellContent } from './directives/cell-content-directive.js';
import { detailsCell } from './directives/details-cell-directive.js';
import { sizerCell } from './directives/sizer-cell-directive.js';

/**
 * A mixin providing rendering of body rows.
 */
export const BodyRenderingMixin = (superClass) =>
  class BodyRenderingMixin extends superClass {
    /** @private */
    __createBodyRow() {
      const renderRoot = document.createDocumentFragment();
      render(this.#bodyRowTemplate(), renderRoot, { host: this });

      const row = renderRoot.firstElementChild;
      row.__id = generateUniqueId();
      row.__renderRoot = renderRoot;
      return row;
    }

    /** @private */
    __scheduleRenderBody() {
      this.__renderBodyDebouncer = Debouncer.debounce(this.__renderBodyDebouncer, microTask, () => {
        this.__renderBody();
      });
    }

    /** @private */
    __renderBody() {
      this.__renderBodyDebouncer?.cancel();

      [...this.$.items.children].forEach((row) => {
        this.__renderBodyRow(row);
      });
    }

    /** @private */
    __renderBodyRow(row) {
      const state = this.#getRowState(row);
      render(this.#bodyRowTemplate(state), row.__renderRoot, { host: this });

      const cells = [...row.children];
      cells.forEach((cell) => {
        cell.__parentRow = row;
      });
      row.__cells = cells.filter((cell) => cell.classList.contains('body-cell'));
    }

    /** @private */
    __scheduleRenderSizer() {
      this.__renderSizerDebouncer = Debouncer.debounce(this.__renderSizerDebouncer, microTask, () => {
        this.__renderSizer();
      });
    }

    /** @private */
    __renderSizer() {
      this.__renderSizerDebouncer?.cancel();

      render(this.#sizerRowTemplate(), this.$.sizer, { host: this });
    }

    #getRowState(row) {
      const columns = this._columnTree.at(-1).toSorted((a, b) => a._order - b._order);
      const visibleColumns = columns.filter((column) => !column.hidden);

      return {
        rowId: row.__id,
        item: this.__getRowItem(row),
        cells: columns.map((column) => {
          return {
            column,
            isFirstCell: column === visibleColumns.at(0),
            isLastCell: column === visibleColumns.at(-1),
          };
        }),
      };
    }

    #bodyRowTemplate = ({ rowId, item, cells } = {}) => {
      return html`
        <tr role="row" tabindex="-1" part="row body-row" class="row body-row" ?loading="${!item}" ${bodyRow()}>
          ${repeat(
            cells ?? [],
            ({ column }) => column._id,
            ({ column, isFirstCell, isLastCell }) => {
              if (column.hidden || column._bodyContentHidden) {
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
                  aria-controls="${this.rowDetailsRenderer ? `vaadin-grid-details-cell-${rowId}` : nothing}"
                  @keydown="${this.__onCellKeyDown}"
                  @mousedown="${this.__onCellMouseDown}"
                  @mouseenter="${this.__onCellMouseEnter}"
                  @mouseleave="${this.__onCellMouseLeave}"
                  ${bodyCell(this, column)}
                >
                  ${cellContent(this, `vaadin-grid-body-cell-content-${rowId}-${column._id}`, {
                    textAlign: column.textAlign,
                    focusButton: column._focusButtonMode,
                  })}
                </td>
              `);
            },
          )}
          ${
            this.rowDetailsRenderer
              ? html`
                  <td
                    id="vaadin-grid-details-cell-${rowId}"
                    role="gridcell"
                    part="cell details-cell"
                    class="cell details-cell"
                    tabindex="-1"
                    frozen
                    @keydown="${this.__onCellKeyDown}"
                    @mousedown="${this.__onCellMouseDown}"
                    @mouseenter="${this.__onCellMouseEnter}"
                    @mouseleave="${this.__onCellMouseLeave}"
                    ${detailsCell(this)}
                  >
                    ${cellContent(this, `vaadin-grid-details-cell-content-${rowId}`)}
                  </td>
                `
              : nothing
          }
        </tr>
      `;
    };

    #sizerRowTemplate = () => {
      return repeat(
        this._getColumnsInOrder(),
        (column) => column._id,
        (column) => html`
          <td part="cell body-cell" class="cell body-cell" ${sizerCell(column)}>
            ${cellContent(this, `vaadin-grid-sizer-cell-content-${column._id}`)}
          </td>
        `,
      );
    };
  };
