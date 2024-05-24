/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { animationFrame } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { get } from '@vaadin/component-base/src/path-utils.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { updateCellState } from './vaadin-grid-helpers.js';

/**
 * @polymerMixin
 */
export const ColumnBaseMixin = (superClass) =>
  class ColumnBaseMixin extends superClass {
    static get properties() {
      return {
        /**
         * When set to true, the column is user-resizable.
         * @default false
         */
        resizable: {
          type: Boolean,
          sync: true,
          value() {
            if (this.localName === 'vaadin-grid-column-group') {
              return;
            }

            const parent = this.parentNode;
            if (parent && parent.localName === 'vaadin-grid-column-group') {
              return parent.resizable || false;
            }
            return false;
          },
        },

        /**
         * When true, the column is frozen. When a column inside of a column group is frozen,
         * all of the sibling columns inside the group will get frozen also.
         * @type {boolean}
         */
        frozen: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * When true, the column is frozen to end of grid.
         *
         * When a column inside of a column group is frozen to end, all of the sibling columns
         * inside the group will get frozen to end also.
         *
         * Column can not be set as `frozen` and `frozenToEnd` at the same time.
         * @attr {boolean} frozen-to-end
         * @type {boolean}
         */
        frozenToEnd: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * When true, the cells for this column will be rendered with the `role` attribute
         * set as `rowheader`, instead of the `gridcell` role value used by default.
         *
         * When a column is set as row header, its cells will be announced by screen readers
         * while navigating to help user identify the current row as uniquely as possible.
         *
         * @attr {boolean} row-header
         * @type {boolean}
         */
        rowHeader: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * When set to true, the cells for this column are hidden.
         */
        hidden: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * Text content to display in the header cell of the column.
         */
        header: {
          type: String,
          sync: true,
        },

        /**
         * Aligns the columns cell content horizontally.
         * Supported values: "start", "center" and "end".
         * @attr {start|center|end} text-align
         * @type {GridColumnTextAlign | null | undefined}
         */
        textAlign: {
          type: String,
          sync: true,
        },

        /**
         * Custom part name for the header cell.
         *
         * @attr {string} header-part-name
         */
        headerPartName: {
          type: String,
          sync: true,
        },

        /**
         * Custom part name for the footer cell.
         *
         * @attr {string} footer-part-name
         */
        footerPartName: {
          type: String,
          sync: true,
        },

        /**
         * @type {boolean}
         * @protected
         */
        _lastFrozen: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * @type {boolean}
         * @protected
         */
        _bodyContentHidden: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * @type {boolean}
         * @protected
         */
        _firstFrozenToEnd: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /** @protected */
        _order: {
          type: Number,
          sync: true,
        },

        /** @private */
        _reorderStatus: {
          type: Boolean,
          sync: true,
        },

        /**
         * @type {Array<!HTMLElement>}
         * @protected
         */
        _emptyCells: Array,

        /** @private */
        _headerCell: Object,

        /** @private */
        _footerCell: Object,

        /** @protected */
        _grid: Object,

        /**
         * By default, the Polymer doesn't invoke the observer
         * during initialization if all of its dependencies are `undefined`.
         * This internal property can be used to force initial invocation of an observer
         * even the other dependencies of the observer are `undefined`.
         *
         * @private
         */
        __initialized: {
          type: Boolean,
          value: true,
        },

        /**
         * Custom function for rendering the header content.
         * Receives two arguments:
         *
         * - `root` The header cell content DOM element. Append your content to it.
         * - `column` The `<vaadin-grid-column>` element.
         *
         * @type {GridHeaderFooterRenderer | null | undefined}
         */
        headerRenderer: {
          type: Function,
          sync: true,
        },

        /**
         * Represents the final header renderer computed on the set of observable arguments.
         * It is supposed to be used internally when rendering the header cell content.
         *
         * @protected
         * @type {GridHeaderFooterRenderer | undefined}
         */
        _headerRenderer: {
          type: Function,
          computed: '_computeHeaderRenderer(headerRenderer, header, __initialized)',
          sync: true,
        },

        /**
         * Custom function for rendering the footer content.
         * Receives two arguments:
         *
         * - `root` The footer cell content DOM element. Append your content to it.
         * - `column` The `<vaadin-grid-column>` element.
         *
         * @type {GridHeaderFooterRenderer | null | undefined}
         */
        footerRenderer: {
          type: Function,
          sync: true,
        },

        /**
         * Represents the final footer renderer computed on the set of observable arguments.
         * It is supposed to be used internally when rendering the footer cell content.
         *
         * @protected
         * @type {GridHeaderFooterRenderer | undefined}
         */
        _footerRenderer: {
          type: Function,
          computed: '_computeFooterRenderer(footerRenderer, __initialized)',
          sync: true,
        },

        /**
         * An internal property that is mainly used by `vaadin-template-renderer`
         * to identify grid column elements.
         *
         * @private
         */
        __gridColumnElement: {
          type: Boolean,
          value: true,
        },
      };
    }

    static get observers() {
      return [
        '_widthChanged(width, _headerCell, _footerCell, _cells)',
        '_frozenChanged(frozen, _headerCell, _footerCell, _cells)',
        '_frozenToEndChanged(frozenToEnd, _headerCell, _footerCell, _cells)',
        '_flexGrowChanged(flexGrow, _headerCell, _footerCell, _cells)',
        '_textAlignChanged(textAlign, _cells, _headerCell, _footerCell)',
        '_orderChanged(_order, _headerCell, _footerCell, _cells)',
        '_lastFrozenChanged(_lastFrozen)',
        '_firstFrozenToEndChanged(_firstFrozenToEnd)',
        '_onRendererOrBindingChanged(_renderer, _cells, _bodyContentHidden, path)',
        '_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header)',
        '_onFooterRendererOrBindingChanged(_footerRenderer, _footerCell)',
        '_resizableChanged(resizable, _headerCell)',
        '_reorderStatusChanged(_reorderStatus, _headerCell, _footerCell, _cells)',
        '_hiddenChanged(hidden, _headerCell, _footerCell, _cells)',
        '_rowHeaderChanged(rowHeader, _cells)',
        '__headerFooterPartNameChanged(_headerCell, _footerCell, headerPartName, footerPartName)',
      ];
    }

    /**
     * @return {!Grid | undefined}
     * @protected
     */
    get _grid() {
      if (!this._gridValue) {
        this._gridValue = this._findHostGrid();
      }
      return this._gridValue;
    }

    /**
     * @return {!Array<!HTMLElement>}
     * @protected
     */
    get _allCells() {
      return []
        .concat(this._cells || [])
        .concat(this._emptyCells || [])
        .concat(this._headerCell)
        .concat(this._footerCell)
        .filter((cell) => cell);
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      // Adds the column cells to the grid after the column is attached
      requestAnimationFrame(() => {
        // Skip if the column has been detached
        if (!this._grid) {
          return;
        }

        this._allCells.forEach((cell) => {
          if (!cell._content.parentNode) {
            this._grid.appendChild(cell._content);
          }
        });
      });
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Removes the column cells from the grid after the column is detached
      requestAnimationFrame(() => {
        // Skip if the column has been attached again
        if (this._grid) {
          return;
        }

        this._allCells.forEach((cell) => {
          if (cell._content.parentNode) {
            cell._content.parentNode.removeChild(cell._content);
          }
        });
      });

      this._gridValue = undefined;
    }

    /** @protected */
    ready() {
      super.ready();

      processTemplates(this);
    }

    /**
     * @return {!Grid | undefined}
     * @protected
     */
    _findHostGrid() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias, consistent-this
      let el = this;
      // Custom elements extending grid must have a specific localName
      while (el && !/^vaadin.*grid(-pro)?$/u.test(el.localName)) {
        el = el.assignedSlot ? el.assignedSlot.parentNode : el.parentNode;
      }
      return el || undefined;
    }

    /** @protected */
    _renderHeaderAndFooter() {
      this._renderHeaderCellContent(this._headerRenderer, this._headerCell);
      this._renderFooterCellContent(this._footerRenderer, this._footerCell);
    }

    /** @private */
    _flexGrowChanged(flexGrow) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('flexGrow');
      }

      this._allCells.forEach((cell) => {
        cell.style.flexGrow = flexGrow;
      });
    }

    /** @private */
    _orderChanged(order) {
      this._allCells.forEach((cell) => {
        cell.style.order = order;
      });
    }

    /** @private */
    _widthChanged(width) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('width');
      }

      this._allCells.forEach((cell) => {
        cell.style.width = width;
      });
    }

    /** @private */
    _frozenChanged(frozen) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('frozen', frozen);
      }

      this._allCells.forEach((cell) => {
        updateCellState(cell, 'frozen', frozen);
      });

      if (this._grid && this._grid._frozenCellsChanged) {
        this._grid._frozenCellsChanged();
      }
    }

    /** @private */
    _frozenToEndChanged(frozenToEnd) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('frozenToEnd', frozenToEnd);
      }

      this._allCells.forEach((cell) => {
        // Skip sizer cells to keep correct scrollWidth.
        if (this._grid && cell.parentElement === this._grid.$.sizer) {
          return;
        }

        updateCellState(cell, 'frozen-to-end', frozenToEnd);
      });

      if (this._grid && this._grid._frozenCellsChanged) {
        this._grid._frozenCellsChanged();
      }
    }

    /** @private */
    _lastFrozenChanged(lastFrozen) {
      this._allCells.forEach((cell) => {
        updateCellState(cell, 'last-frozen', lastFrozen);
      });

      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._lastFrozen = lastFrozen;
      }
    }

    /** @private */
    _firstFrozenToEndChanged(firstFrozenToEnd) {
      this._allCells.forEach((cell) => {
        // Skip sizer cells to keep correct scrollWidth.
        if (this._grid && cell.parentElement === this._grid.$.sizer) {
          return;
        }

        updateCellState(cell, 'first-frozen-to-end', firstFrozenToEnd);
      });

      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._firstFrozenToEnd = firstFrozenToEnd;
      }
    }

    /** @private */
    _rowHeaderChanged(rowHeader, cells) {
      if (!cells) {
        return;
      }

      cells.forEach((cell) => {
        cell.setAttribute('role', rowHeader ? 'rowheader' : 'gridcell');
      });
    }

    /**
     * @param {string} path
     * @return {string}
     * @protected
     */
    _generateHeader(path) {
      return path
        .substr(path.lastIndexOf('.') + 1)
        .replace(/([A-Z])/gu, '-$1')
        .toLowerCase()
        .replace(/-/gu, ' ')
        .replace(/^./u, (match) => match.toUpperCase());
    }

    /** @private */
    _reorderStatusChanged(reorderStatus) {
      const prevStatus = this.__previousReorderStatus;
      const oldPart = prevStatus ? `reorder-${prevStatus}-cell` : '';
      const newPart = `reorder-${reorderStatus}-cell`;

      this._allCells.forEach((cell) => {
        updateCellState(cell, 'reorder-status', reorderStatus, newPart, oldPart);
      });

      this.__previousReorderStatus = reorderStatus;
    }

    /** @private */
    _resizableChanged(resizable, headerCell) {
      if (resizable === undefined || headerCell === undefined) {
        return;
      }

      if (headerCell) {
        [headerCell].concat(this._emptyCells).forEach((cell) => {
          if (cell) {
            const existingHandle = cell.querySelector('[part~="resize-handle"]');
            if (existingHandle) {
              cell.removeChild(existingHandle);
            }

            if (resizable) {
              const handle = document.createElement('div');
              handle.setAttribute('part', 'resize-handle');
              cell.appendChild(handle);
            }
          }
        });
      }
    }

    /** @private */
    _textAlignChanged(textAlign) {
      if (textAlign === undefined || this._grid === undefined) {
        return;
      }
      if (['start', 'end', 'center'].indexOf(textAlign) === -1) {
        console.warn('textAlign can only be set as "start", "end" or "center"');
        return;
      }

      let textAlignFallback;
      if (getComputedStyle(this._grid).direction === 'ltr') {
        if (textAlign === 'start') {
          textAlignFallback = 'left';
        } else if (textAlign === 'end') {
          textAlignFallback = 'right';
        }
      } else if (textAlign === 'start') {
        textAlignFallback = 'right';
      } else if (textAlign === 'end') {
        textAlignFallback = 'left';
      }

      this._allCells.forEach((cell) => {
        cell._content.style.textAlign = textAlign;
        if (getComputedStyle(cell._content).textAlign !== textAlign) {
          cell._content.style.textAlign = textAlignFallback;
        }
      });
    }

    /** @private */
    _hiddenChanged(hidden) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('hidden', hidden);
      }

      if (!!hidden !== !!this._previousHidden && this._grid) {
        if (hidden === true) {
          this._allCells.forEach((cell) => {
            if (cell._content.parentNode) {
              cell._content.parentNode.removeChild(cell._content);
            }
          });
        }
        this._grid._debouncerHiddenChanged = Debouncer.debounce(
          this._grid._debouncerHiddenChanged,
          animationFrame,
          () => {
            if (this._grid && this._grid._renderColumnTree) {
              this._grid._renderColumnTree(this._grid._columnTree);
            }
          },
        );

        if (this._grid._debounceUpdateFrozenColumn) {
          this._grid._debounceUpdateFrozenColumn();
        }

        if (this._grid._resetKeyboardNavigation) {
          this._grid._resetKeyboardNavigation();
        }
      }
      this._previousHidden = hidden;
    }

    /** @protected */
    _runRenderer(renderer, cell, model) {
      const isVisibleBodyCell = model && model.item && !cell.parentElement.hidden;
      const shouldRender = isVisibleBodyCell || renderer === this._headerRenderer || renderer === this._footerRenderer;
      if (!shouldRender) {
        return;
      }

      const args = [cell._content, this];
      if (isVisibleBodyCell) {
        args.push(model);
      }

      renderer.apply(this, args);
    }

    /**
     * Renders the content to the given cells using a renderer.
     *
     * @private
     */
    __renderCellsContent(renderer, cells) {
      // Skip if the column is hidden or not attached to a grid.
      if (this.hidden || !this._grid) {
        return;
      }

      cells.forEach((cell) => {
        if (!cell.parentElement) {
          return;
        }

        const model = this._grid.__getRowModel(cell.parentElement);

        if (!renderer) {
          return;
        }

        if (cell._renderer !== renderer) {
          this._clearCellContent(cell);
        }

        cell._renderer = renderer;

        this._runRenderer(renderer, cell, model);
      });
    }

    /**
     * Clears the content of a cell.
     *
     * @protected
     */
    _clearCellContent(cell) {
      cell._content.innerHTML = '';
      // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
      // When clearing the rendered content, this part needs to be manually disposed of.
      // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
      delete cell._content._$litPart$;
    }

    /**
     * Renders the header cell content using a renderer,
     * and then updates the visibility of the parent row depending on
     * whether all its children cells are empty or not.
     *
     * @protected
     */
    _renderHeaderCellContent(headerRenderer, headerCell) {
      if (!headerCell || !headerRenderer) {
        return;
      }

      this.__renderCellsContent(headerRenderer, [headerCell]);
      if (this._grid && headerCell.parentElement) {
        this._grid.__debounceUpdateHeaderFooterRowVisibility(headerCell.parentElement);
      }
    }

    /** @protected */
    _onHeaderRendererOrBindingChanged(headerRenderer, headerCell, ..._bindings) {
      this._renderHeaderCellContent(headerRenderer, headerCell);
    }

    /** @private */
    __headerFooterPartNameChanged(headerCell, footerCell, headerPartName, footerPartName) {
      [
        { cell: headerCell, partName: headerPartName },
        { cell: footerCell, partName: footerPartName },
      ].forEach(({ cell, partName }) => {
        if (cell) {
          const customParts = cell.__customParts || [];
          cell.part.remove(...customParts);

          cell.__customParts = partName ? partName.trim().split(' ') : [];
          cell.part.add(...cell.__customParts);
        }
      });
    }

    /**
     * Renders the content of body cells using a renderer.
     *
     * @protected
     */
    _renderBodyCellsContent(renderer, cells) {
      if (!cells || !renderer) {
        return;
      }

      this.__renderCellsContent(renderer, cells);
    }

    /** @protected */
    _onRendererOrBindingChanged(renderer, cells, ..._bindings) {
      this._renderBodyCellsContent(renderer, cells);
    }

    /**
     * Renders the footer cell content using a renderer
     * and then updates the visibility of the parent row depending on
     * whether all its children cells are empty or not.
     *
     * @protected
     */
    _renderFooterCellContent(footerRenderer, footerCell) {
      if (!footerCell || !footerRenderer) {
        return;
      }

      this.__renderCellsContent(footerRenderer, [footerCell]);
      if (this._grid && footerCell.parentElement) {
        this._grid.__debounceUpdateHeaderFooterRowVisibility(footerCell.parentElement);
      }
    }

    /** @protected */
    _onFooterRendererOrBindingChanged(footerRenderer, footerCell) {
      this._renderFooterCellContent(footerRenderer, footerCell);
    }

    /** @private */
    __setTextContent(node, textContent) {
      if (node.textContent !== textContent) {
        node.textContent = textContent;
      }
    }

    /**
     * Renders the text header to the header cell.
     *
     * @private
     */
    __textHeaderRenderer() {
      this.__setTextContent(this._headerCell._content, this.header);
    }

    /**
     * Computes the property name based on the path and renders it to the header cell.
     * If the path is not defined, then nothing is rendered.
     *
     * @protected
     */
    _defaultHeaderRenderer() {
      if (!this.path) {
        return;
      }

      this.__setTextContent(this._headerCell._content, this._generateHeader(this.path));
    }

    /**
     * Computes the item property value based on the path and renders it to the body cell.
     * If the path is not defined, then nothing is rendered.
     *
     * @protected
     */
    _defaultRenderer(root, _owner, { item }) {
      if (!this.path) {
        return;
      }

      this.__setTextContent(root, get(this.path, item));
    }

    /**
     * By default, nothing is rendered to the footer cell.
     *
     * @protected
     */
    _defaultFooterRenderer() {}

    /**
     * Computes the final header renderer for the `_headerRenderer` computed property.
     * All the arguments are observable by the Polymer, it re-calls the method
     * once an argument is changed to update the property value.
     *
     * @protected
     * @return {GridHeaderFooterRenderer | undefined}
     */
    _computeHeaderRenderer(headerRenderer, header) {
      if (headerRenderer) {
        return headerRenderer;
      }

      if (header !== undefined && header !== null) {
        return this.__textHeaderRenderer;
      }

      return this._defaultHeaderRenderer;
    }

    /**
     * Computes the final renderer for the `_renderer` property.
     * All the arguments are observable by the Polymer, it re-calls the method
     * once an argument is changed to update the property value.
     *
     * @protected
     * @return {GridBodyRenderer | undefined}
     */
    _computeRenderer(renderer) {
      if (renderer) {
        return renderer;
      }

      return this._defaultRenderer;
    }

    /**
     * Computes the final footer renderer for the `_footerRenderer` property.
     * All the arguments are observable by the Polymer, it re-calls the method
     * once an argument is changed to update the property value.
     *
     * @protected
     * @return {GridHeaderFooterRenderer | undefined}
     */
    _computeFooterRenderer(footerRenderer) {
      if (footerRenderer) {
        return footerRenderer;
      }

      return this._defaultFooterRenderer;
    }
  };

/**
 * @polymerMixin
 * @mixes ColumnBaseMixin
 * @mixes DirMixin
 */
export const GridColumnMixin = (superClass) =>
  class extends ColumnBaseMixin(DirMixin(superClass)) {
    static get properties() {
      return {
        /**
         * Width of the cells for this column.
         *
         * Please note that using the `em` length unit is discouraged as
         * it might lead to misalignment issues if the header, body, and footer
         * cells have different font sizes. Instead, use `rem` if you need
         * a length unit relative to the font size.
         */
        width: {
          type: String,
          value: '100px',
          sync: true,
        },

        /**
         * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
         * @attr {number} flex-grow
         * @type {number}
         */
        flexGrow: {
          type: Number,
          value: 1,
          sync: true,
        },

        /**
         * Custom function for rendering the cell content.
         * Receives three arguments:
         *
         * - `root` The cell content DOM element. Append your content to it.
         * - `column` The `<vaadin-grid-column>` element.
         * - `model` The object with the properties related with
         *   the rendered item, contains:
         *   - `model.index` The index of the item.
         *   - `model.item` The item.
         *   - `model.expanded` Sublevel toggle state.
         *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
         *   - `model.selected` Selected state.
         *   - `model.detailsOpened` Details opened state.
         *
         * @type {GridBodyRenderer | null | undefined}
         */
        renderer: {
          type: Function,
          sync: true,
        },

        /**
         * Represents the final renderer computed on the set of observable arguments.
         * It is supposed to be used internally when rendering the content of a body cell.
         *
         * @protected
         * @type {GridBodyRenderer | undefined}
         */
        _renderer: {
          type: Function,
          computed: '_computeRenderer(renderer, __initialized)',
          sync: true,
        },

        /**
         * Path to an item sub-property whose value gets displayed in the column body cells.
         * The property name is also shown in the column header if an explicit header or renderer isn't defined.
         */
        path: {
          type: String,
          sync: true,
        },

        /**
         * Automatically sets the width of the column based on the column contents when this is set to `true`.
         *
         * For performance reasons the column width is calculated automatically only once when the grid items
         * are rendered for the first time and the calculation only considers the rows which are currently
         * rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell
         * content changes, the column width might not match the contents anymore.
         *
         * Hidden columns are ignored in the calculation and their widths are not automatically updated when
         * you show a column that was initially hidden.
         *
         * You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.
         *
         * The column width may still grow larger when `flexGrow` is not 0.
         * @attr {boolean} auto-width
         * @type {boolean}
         */
        autoWidth: {
          type: Boolean,
          value: false,
        },

        /**
         * When true, wraps the cell's slot into an element with role="button", and sets
         * the tabindex attribute on the button element, instead of the cell itself.
         * This is needed to keep focus in sync with VoiceOver cursor when navigating
         * with Control + Option + arrow keys: focusing the `<td>` element does not fire
         * a focus event, but focusing an element with role="button" inside a cell fires it.
         * @protected
         */
        _focusButtonMode: {
          type: Boolean,
          value: false,
        },

        /**
         * @type {Array<!HTMLElement>}
         * @protected
         */
        _cells: {
          type: Array,
          sync: true,
        },
      };
    }
  };
