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
    /** @protected */
    ready() {
      super.ready();

      this.$.sizer.__id = 'sizer';
    }

    /** @private */
    __createBodyRow() {
      const fragment = document.createDocumentFragment();
      const endMarker = fragment.appendChild(document.createComment(''));

      const litPart = render(this.#bodyRowTemplate(), fragment, {
        host: this,
        renderBefore: endMarker,
      });

      const row = fragment.firstElementChild;
      row.__id = generateUniqueId();
      row.__startMarker = litPart.startNode;
      row.__endMarker = endMarker;
      return row;
    }

    /** @private */
    __renderBodyRow(row, index = row.index) {
      if (row === this.$.sizer) {
        render(this.#bodyCellsTemplate(row), row, { host: this });
        return;
      }

      render(this.#bodyRowTemplate(row, index), row.parentNode, {
        host: this,
        renderBefore: row.__endMarker,
      });
    }

    #bodyRowTemplate = (row, index) => {
      return html`
        <tr role="row" tabindex="-1" part="row body-row" class="row body-row" .index="${index}">
          ${row ? this.#bodyCellsTemplate(row) : nothing}
        </tr>
      `;
    };

    #bodyCellsTemplate = (row) => {
      const isSizerRow = row === this.$.sizer;
      const columns = this._columnTree[this._columnTree.length - 1].toSorted((a, b) => a._order - b._order);
      const visibleColumns = columns.filter((column) => !column.hidden);

      return html`
        ${repeat(
          columns,
          (column) => column._id,
          (column) => {
            if (column.hidden || (column._bodyContentHidden && !isSizerRow)) {
              return cache(nothing);
            }

            const isFirstCell = column === visibleColumns.at(0);
            const isLastCell = column === visibleColumns.at(-1);
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
                .__parentRow=${row}
              >
                ${cellContent(this, `vaadin-grid-body-cell-content-${row.__id}-${column._id}`, {
                  textAlign: column.textAlign,
                  focusButton: column._focusButtonMode,
                })}
              </td>
            `);
          },
        )}
        ${
          this.rowDetailsRenderer || row.__detailsCell
            ? html`
                <td
                  id="vaadin-grid-details-cell-${row.__id}"
                  role="gridcell"
                  part="cell details-cell"
                  class="cell details-cell"
                  tabindex="-1"
                  frozen
                  @keydown="${this.__onCellKeyDown}"
                  @mousedown=${this.__onCellMouseDown}
                  @mouseenter=${this.__onCellMouseEnter}
                  @mouseleave=${this.__onCellMouseLeave}
                  .__parentRow=${row}
                >
                  ${cellContent(this, `vaadin-grid-details-cell-content-${row.__id}`)}
                </td>
              `
            : nothing
        }
      `;
    };
  };
