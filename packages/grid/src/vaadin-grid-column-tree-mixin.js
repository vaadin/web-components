/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, nothing, render } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { html as staticHtml, literal } from 'lit/static-html.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { isAndroid, isIOS } from '@vaadin/component-base/src/browser-utils.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { cellState } from './vaadin-grid-cell-state-directive.js';
import { iterateChildren, updatePart, updateState } from './vaadin-grid-helpers.js';

/**
 * A mixin that renders the column tree into the header, footer, body
 * and sizer rows using Lit.
 */
export const ColumnTreeMixin = (superClass) =>
  class ColumnTreeMixin extends superClass {
    /**
     * Schedules a debounced re-render of the column tree. Flush
     * `__renderColumnTreeDebouncer` to force the render synchronously.
     * @protected
     */
    _requestRenderColumnTree() {
      // Skip requests made by column property observers that fire while the
      // column tree is being rendered - the ongoing render already reflects
      // the current column state.
      if (this.__renderingColumnTree) {
        return;
      }

      this.__renderColumnTreeDebouncer = Debouncer.debounce(this.__renderColumnTreeDebouncer, microTask, () => {
        if (this._columnTree) {
          this._renderColumnTree(this._columnTree);
        }
      });
    }

    /**
     * @param {!Array<!GridColumn>} columnTree
     * @protected
     */
    _renderColumnTree(columnTree) {
      this.__renderingColumnTree = true;

      // Cancel a possibly pending debounced render request
      this.__renderColumnTreeDebouncer?.cancel();

      iterateChildren(this.$.items, (row) => {
        this.__renderBodyRow(row, columnTree[columnTree.length - 1]);
      });

      while (this.$.header.children.length < columnTree.length) {
        const headerRow = document.createElement('tr');
        headerRow.setAttribute('role', 'row');
        headerRow.setAttribute('tabindex', '-1');
        updatePart(headerRow, 'row', true);
        updatePart(headerRow, 'header-row', true);
        this.$.header.appendChild(headerRow);

        const footerRow = document.createElement('tr');
        footerRow.setAttribute('role', 'row');
        footerRow.setAttribute('tabindex', '-1');
        updatePart(footerRow, 'row', true);
        updatePart(footerRow, 'footer-row', true);
        this.$.footer.appendChild(footerRow);
      }
      while (this.$.header.children.length > columnTree.length) {
        this.$.header.removeChild(this.$.header.firstElementChild);
        this.$.footer.removeChild(this.$.footer.firstElementChild);
      }

      iterateChildren(this.$.header, (headerRow, index) => {
        this.__renderHeaderFooterRow(headerRow, columnTree[index], 'header', index === columnTree.length - 1);
      });

      iterateChildren(this.$.footer, (footerRow, index) => {
        this.__renderHeaderFooterRow(footerRow, columnTree[columnTree.length - 1 - index], 'footer', index === 0);
      });

      // Sizer rows
      this.__renderSizerRow(this.$.sizer, columnTree[columnTree.length - 1]);

      this.__updateHeaderFooterRowParts('header');
      this.__updateHeaderFooterRowParts('footer');
      this._resizeHandler();
      this._frozenCellsChanged();
      this._resetKeyboardNavigation();
      this.__a11yUpdateHeaderRows();
      this.__a11yUpdateFooterRows();
      this.generateCellPartNames();
      this.__updateHeaderAndFooter();

      this.__renderingColumnTree = false;
    }

    /**
     * Returns the light DOM content element for the given cell key in the row,
     * creating it and appending it to the grid's light DOM on first use.
     *
     * @param {!HTMLTableRowElement} row
     * @param {!GridColumn | string} key
     * @return {!HTMLElement}
     * @private
     */
    __getCellContent(row, key) {
      if (!row.__cellContents) {
        row.__cellContents = new Map();
      }
      let content = row.__cellContents.get(key);
      if (!content) {
        const contentId = (this._contentIndex = this._contentIndex + 1 || 0);
        content = document.createElement('vaadin-grid-cell-content');
        content.setAttribute('slot', `vaadin-grid-cell-content-${contentId}`);
        this.appendChild(content);
        row.__cellContents.set(key, content);
      }
      return content;
    }

    /** @private */
    __onCellKeyDown(event) {
      const column = event.currentTarget._column;
      column?._onCellKeyDown?.(event);
    }

    /** @private */
    __onCellMouseEnter(event) {
      // For now we only support tooltip on desktop
      if (isAndroid || isIOS) {
        return;
      }
      if (!this.$.scroller.hasAttribute('scrolling')) {
        this._showTooltip(event);
      }
    }

    /** @private */
    __onCellMouseLeave() {
      this._hideTooltip();
    }

    /** @private */
    __onCellMouseDown() {
      this._hideTooltip(true);
    }

    /**
     * @param {!HTMLTableRowElement} row
     * @param {!Array<!GridColumn>} columns
     * @param {string} section
     * @param {boolean} isColumnRow
     * @private
     */
    __renderHeaderFooterRow(row, columns, section, isColumnRow) {
      const visibleColumns = columns.filter((column) => !column.hidden).toSorted((a, b) => a._order - b._order);
      const lastFrozenColumn = visibleColumns.filter((column) => column.frozen).at(-1);
      const firstFrozenToEndColumn = visibleColumns.find((column) => column.frozenToEnd);

      const isHeader = section === 'header';
      const cellTag = isHeader ? literal`th` : literal`td`;

      render(
        html`${repeat(
          visibleColumns,
          (column) => column,
          (column, index) => {
            const content = this.__getCellContent(row, column);
            return staticHtml`
              <${cellTag}
                id=${content.slot.replace('-content-', '-')}
                role=${isHeader ? 'columnheader' : 'gridcell'}
                tabindex="-1"
                ${cellState({
                  states: {
                    'first-column': index === 0,
                    'last-column': index === visibleColumns.length - 1,
                    frozen: column.frozen,
                    'last-frozen': column === lastFrozenColumn,
                    'frozen-to-end': column.frozenToEnd,
                    'first-frozen-to-end': column === firstFrozenToEndColumn,
                  },
                  parts: {
                    cell: true,
                    [`${section}-cell`]: true,
                    [`reorder-${column._reorderStatus}-cell`]: !!column._reorderStatus,
                  },
                  attributes: {
                    'reorder-status': column._reorderStatus,
                  },
                })}
                ._column=${column}
                ._content=${content}
                @keydown=${this.__onCellKeyDown}
                @mouseenter=${this.__onCellMouseEnter}
                @mouseleave=${this.__onCellMouseLeave}
                @mousedown=${this.__onCellMouseDown}
              >
                <slot name=${content.slot}></slot>
              </td>
            `;
          },
        )}`,
        row,
        { host: this },
      );

      // Sync the cell caches that the rest of the grid still relies on
      iterateChildren(row, (cell) => {
        const column = cell._column;
        if (isColumnRow || column.localName === 'vaadin-grid-column-group') {
          column[`_${section}Cell`] = cell;
        } else {
          if (!column._emptyCells) {
            column._emptyCells = [];
          }
          if (!column._emptyCells.includes(cell)) {
            column._emptyCells.push(cell);
          }
        }
      });

      this.__debounceUpdateHeaderFooterRowVisibility(row);
      this._frozenCellsChanged();
    }

    /**
     * @param {!HTMLTableRowElement} row
     * @param {!Array<!GridColumn>} [columns]
     * @private
     */
    __renderBodyRow(row, columns = this._columnTree[this._columnTree.length - 1]) {
      // Suppress render requests from column property observers that fire
      // while the row is rendered - the row already reflects the current
      // column state. Restored at the end as this may be a nested call.
      const wasRenderingColumnTree = this.__renderingColumnTree;
      this.__renderingColumnTree = true;

      const visibleColumns = columns.filter((column) => !column.hidden).toSorted((a, b) => a._order - b._order);
      const lastFrozenColumn = visibleColumns.filter((column) => column.frozen).at(-1);
      const firstFrozenToEndColumn = visibleColumns.find((column) => column.frozenToEnd);
      // The sizer row skips the "frozen to end" states to keep correct scrollWidth
      const isSizerRow = row === this.$.sizer;

      // Resolve the item and the model for the row. The sizer row and rows
      // not yet assigned an index by the virtualizer have neither.
      const hasIndex = !isSizerRow && row.index !== undefined;
      const item = hasIndex ? this.__getRowItem(row) : undefined;
      if (item) {
        row._item = item;
      }
      const loading = hasIndex && !item;
      const model = item ? this.__getRowModel(row) : undefined;

      // Row states as attributes and parts on the row itself. The row is
      // the Lit render container, so the template cannot manage these.
      let rowStates = {};
      if (hasIndex) {
        this.__a11yUpdateRowRowindex(row);

        rowStates = {
          first: row.index === 0,
          last: row.index === this._flatSize - 1,
          odd: row.index % 2 !== 0,
          even: row.index % 2 === 0,
          ...(model
            ? {
                expanded: model.expanded,
                collapsed: this.__isRowExpandable(row),
                selected: model.selected,
                nonselectable: this.__isItemSelectable(model.item) === false,
                'details-opened': model.detailsOpened,
              }
            : {}),
        };

        Object.entries(rowStates).forEach(([state, value]) => {
          updateState(row, state, value);
          updatePart(row, `${state}-row`, value);
        });
        updateState(row, 'loading', loading);
      }

      // Cell states that reflect the row state
      const rowCellStates = { 'loading-row': loading };
      Object.entries(rowStates).forEach(([state, value]) => {
        rowCellStates[`${state}-row`] = value;
      });

      let detailsCell = nothing;
      let detailsCellId;
      if (visibleColumns.length > 0 && this.rowDetailsRenderer) {
        const content = this.__getCellContent(row, 'details');
        detailsCellId = content.slot.replace('-content-', '-');
        detailsCell = html`
          <td
            id=${detailsCellId}
            class="cell details-cell"
            part="cell details-cell"
            role="gridcell"
            tabindex="-1"
            frozen
            ?hidden=${!model || !model.detailsOpened}
            ._content=${content}
            @mouseenter=${this.__onCellMouseEnter}
            @mouseleave=${this.__onCellMouseLeave}
            @mousedown=${this.__onCellMouseDown}
          >
            <slot name=${content.slot}></slot>
          </td>
        `;
      }

      render(
        html`
          ${repeat(
            visibleColumns,
            (column) => column,
            (column, index) => {
              const content = this.__getCellContent(row, column);
              return html`
                <td
                  id=${content.slot.replace('-content-', '-')}
                  role="gridcell"
                  tabindex=${column._focusButtonMode ? nothing : '-1'}
                  aria-controls=${detailsCellId || nothing}
                  ${cellState({
                    states: {
                      ...rowCellStates,
                      'first-column': index === 0,
                      'last-column': index === visibleColumns.length - 1,
                      frozen: column.frozen,
                      'last-frozen': column === lastFrozenColumn,
                      'frozen-to-end': !isSizerRow && column.frozenToEnd,
                      'first-frozen-to-end': !isSizerRow && column === firstFrozenToEndColumn,
                    },
                    parts: {
                      cell: true,
                      'body-cell': true,
                      [`reorder-${column._reorderStatus}-cell`]: !!column._reorderStatus,
                    },
                    attributes: {
                      'reorder-status': column._reorderStatus,
                    },
                  })}
                  ._column=${column}
                  ._content=${content}
                  @keydown=${this.__onCellKeyDown}
                  @mouseenter=${this.__onCellMouseEnter}
                  @mouseleave=${this.__onCellMouseLeave}
                  @mousedown=${this.__onCellMouseDown}
                >
                  ${
                    column._focusButtonMode
                      ? html`<div role="button" tabindex="-1"><slot name=${content.slot}></slot></div>`
                      : html`<slot name=${content.slot}></slot>`
                  }
                </td>
              `;
            },
          )}
          ${detailsCell}
        `,
        row,
        { host: this },
      );

      // Sync the cell caches that the rest of the grid still relies on
      row.__cells = [];
      row.__detailsCell = null;
      iterateChildren(row, (cell) => {
        const column = cell._column;
        if (!column) {
          // The details cell has no column
          row.__detailsCell = cell;
          this._detailsCellResizeObserver.observe(cell);
          return;
        }

        cell.__parentRow = row;
        row.__cells.push(cell);

        if (column._focusButtonMode && !cell._focusButton) {
          const div = cell.firstElementChild;
          // Patch `focus()` to use the button
          cell._focusButton = div;
          cell.focus = function (options) {
            cell._focusButton.focus(options);
          };
        }

        if (isSizerRow) {
          column._sizerCell = cell;
        }

        column._cells = [...new Set([...(column._cells ?? []), cell])];
      });

      if (hasIndex) {
        // Update the drag and drop state
        this._filterDragAndDrop(row, model);

        if (model) {
          this.__updateDragSourceParts(row, model);
        }

        // Run the custom cell part name generator (last to keep the generated
        // part names at the end of the part attribute)
        this._generateCellPartNames(row, model);

        if (model) {
          // Assign the details cell renderer when the details are opened
          if (row.__detailsCell && model.detailsOpened) {
            row.__detailsCell._renderer = this.rowDetailsRenderer;
          }

          // Run the cell renderers
          iterateChildren(row, (cell) => {
            if (cell._column && !cell._column.isConnected) {
              return;
            }
            if (cell._renderer) {
              const owner = cell._column || this;
              cell._renderer.call(owner, cell._content, owner, model);
            }
          });

          this._updateDetailsCellHeight(row);

          this.__a11yUpdateRowLevel(row, model.level);
          this.__a11yUpdateRowSelected(row, model.selected);
          this.__a11yUpdateRowExpanded(row);
        }
      }

      this._frozenCellsChanged();

      this.__renderingColumnTree = wasRenderingColumnTree;
    }

    /**
     * @param {!HTMLTableRowElement} row
     * @param {!Array<!GridColumn>} columns
     * @private
     */
    __renderSizerRow(row, columns) {
      this.__renderBodyRow(row, columns);
    }
  };
