/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { animationFrame } from '@vaadin/component-base/src/async.js';

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
          value: function () {
            if (this.localName === 'vaadin-grid-column-group') {
              return;
            }

            const parent = this.parentNode;
            if (parent && parent.localName === 'vaadin-grid-column-group') {
              return parent.resizable || false;
            } else {
              return false;
            }
          }
        },

        /**
         * When true, the column is frozen. When a column inside of a column group is frozen,
         * all of the sibling columns inside the group will get frozen also.
         * @type {boolean}
         */
        frozen: {
          type: Boolean,
          value: false
        },

        /**
         * When set to true, the cells for this column are hidden.
         */
        hidden: {
          type: Boolean,
          value: false
        },

        /**
         * Text content to display in the header cell of the column.
         */
        header: {
          type: String
        },

        /**
         * Aligns the columns cell content horizontally.
         * Supported values: "start", "center" and "end".
         * @attr {start|center|end} text-align
         * @type {GridColumnTextAlign | null | undefined}
         */
        textAlign: {
          type: String
        },

        /**
         * @type {boolean}
         * @protected
         */
        _lastFrozen: {
          type: Boolean,
          value: false
        },

        /** @protected */
        _order: Number,

        /** @private */
        _reorderStatus: Boolean,

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
          value: true
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
        headerRenderer: Function,

        /**
         * Represents the final header renderer computed on the set of observable arguments.
         * It is supposed to be used internally when rendering the header cell content.
         *
         * @protected
         * @type {GridHeaderFooterRenderer | undefined}
         */
        _headerRenderer: {
          type: Function,
          computed: '_computeHeaderRenderer(headerRenderer, header, __initialized)'
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
        footerRenderer: Function,

        /**
         * Represents the final footer renderer computed on the set of observable arguments.
         * It is supposed to be used internally when rendering the footer cell content.
         *
         * @protected
         * @type {GridHeaderFooterRenderer | undefined}
         */
        _footerRenderer: {
          type: Function,
          computed: '_computeFooterRenderer(footerRenderer, __initialized)'
        },

        /**
         * An internal property that is mainly used by `vaadin-template-renderer`
         * to identify grid column elements.
         *
         * @private
         */
        __gridColumnElement: {
          type: Boolean,
          value: true
        }
      };
    }

    static get observers() {
      return [
        '_widthChanged(width, _headerCell, _footerCell, _cells.*)',
        '_frozenChanged(frozen, _headerCell, _footerCell, _cells.*)',
        '_flexGrowChanged(flexGrow, _headerCell, _footerCell, _cells.*)',
        '_textAlignChanged(textAlign, _cells.*, _headerCell, _footerCell)',
        '_orderChanged(_order, _headerCell, _footerCell, _cells.*)',
        '_lastFrozenChanged(_lastFrozen)',
        '_onRendererOrBindingChanged(_renderer, _cells, _cells.*, path)',
        '_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header)',
        '_onFooterRendererOrBindingChanged(_footerRenderer, _footerCell)',
        '_resizableChanged(resizable, _headerCell)',
        '_reorderStatusChanged(_reorderStatus, _headerCell, _footerCell, _cells.*)',
        '_hiddenChanged(hidden, _headerCell, _footerCell, _cells.*)'
      ];
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      // Adds the column cells to the grid after the column is attached
      requestAnimationFrame(() => {
        // Skip if the column has been detached
        if (!this._grid) return;

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
        if (this._grid) return;

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
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let el = this;
      // Custom elements extending grid must have a specific localName
      while (el && !/^vaadin.*grid(-pro)?$/.test(el.localName)) {
        el = el.assignedSlot ? el.assignedSlot.parentNode : el.parentNode;
      }
      return el || undefined;
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
    _renderHeaderAndFooter() {
      this._renderHeaderCellContent(this._headerRenderer, this._headerCell);
      this._renderFooterCellContent(this._footerRenderer, this._footerCell);
    }

    /** @private */
    _flexGrowChanged(flexGrow) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('flexGrow');
      }

      this._allCells.forEach((cell) => (cell.style.flexGrow = flexGrow));
    }

    /** @private */
    _orderChanged(order) {
      this._allCells.forEach((cell) => (cell.style.order = order));
    }

    /** @private */
    _widthChanged(width) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('width');
      }

      this._allCells.forEach((cell) => (cell.style.width = width));
    }

    /** @private */
    _frozenChanged(frozen) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('frozen', frozen);
      }

      this._allCells.forEach((cell) => cell.toggleAttribute('frozen', frozen));

      this._grid && this._grid._frozenCellsChanged && this._grid._frozenCellsChanged();
    }

    /** @private */
    _lastFrozenChanged(lastFrozen) {
      this._allCells.forEach((cell) => cell.toggleAttribute('last-frozen', lastFrozen));

      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._lastFrozen = lastFrozen;
      }
    }

    /**
     * @param {string} path
     * @return {string}
     * @protected
     */
    _generateHeader(path) {
      return path
        .substr(path.lastIndexOf('.') + 1)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/-/g, ' ')
        .replace(/^./, (match) => match.toUpperCase());
    }

    /** @private */
    _reorderStatusChanged(reorderStatus) {
      this._allCells.forEach((cell) => cell.setAttribute('reorder-status', reorderStatus));
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
      if (textAlign === undefined) {
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
      } else {
        if (textAlign === 'start') {
          textAlignFallback = 'right';
        } else if (textAlign === 'end') {
          textAlignFallback = 'left';
        }
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
          }
        );

        this._grid._updateLastFrozen && this._grid._updateLastFrozen();
        this._grid._resetKeyboardNavigation && this._grid._resetKeyboardNavigation();
      }
      this._previousHidden = hidden;
    }

    /** @protected */
    _runRenderer(renderer, cell, model) {
      const args = [cell._content, this];
      if (model && model.item) {
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
        const model = this._grid.__getRowModel(cell.parentElement);

        if (!renderer) return;

        if (cell._renderer !== renderer) {
          this._clearCellContent(cell);
        }

        cell._renderer = renderer;

        if (model.item || renderer === this._headerRenderer || renderer === this._footerRenderer) {
          this._runRenderer(renderer, cell, model);
        }
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
      this._grid.__updateHeaderFooterRowVisibility(headerCell.parentElement);
    }

    /** @protected */
    _onHeaderRendererOrBindingChanged(headerRenderer, headerCell, ..._bindings) {
      this._renderHeaderCellContent(headerRenderer, headerCell);
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
      this._grid.__updateHeaderFooterRowVisibility(footerCell.parentElement);
    }

    /** @protected */
    _onFooterRendererOrBindingChanged(footerRenderer, footerCell) {
      this._renderFooterCellContent(footerRenderer, footerCell);
    }

    /** @private */
    __setTextContent(node, textContent) {
      node.textContent !== textContent && (node.textContent = textContent);
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
      if (!this.path) return;

      this.__setTextContent(this._headerCell._content, this._generateHeader(this.path));
    }

    /**
     * Computes the item property value based on the path and renders it to the body cell.
     * If the path is not defined, then nothing is rendered.
     *
     * @protected
     */
    _defaultRenderer(root, _owner, { item }) {
      if (!this.path) return;

      this.__setTextContent(root, this.get(this.path, item));
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
 * A `<vaadin-grid-column>` is used to configure how a column in `<vaadin-grid>`
 * should look like.
 *
 * See [`<vaadin-grid>`](#/elements/vaadin-grid) documentation for instructions on how
 * to configure the `<vaadin-grid-column>`.
 *
 * @extends HTMLElement
 * @mixes ColumnBaseMixin
 */
class GridColumn extends ColumnBaseMixin(DirMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-grid-column';
  }

  static get properties() {
    return {
      /**
       * Width of the cells for this column.
       */
      width: {
        type: String,
        value: '100px'
      },

      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       * @attr {number} flex-grow
       * @type {number}
       */
      flexGrow: {
        type: Number,
        value: 1
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
      renderer: Function,

      /**
       * Represents the final renderer computed on the set of observable arguments.
       * It is supposed to be used internally when rendering the content of a body cell.
       *
       * @protected
       * @type {GridBodyRenderer | undefined}
       */
      _renderer: {
        type: Function,
        computed: '_computeRenderer(renderer, __initialized)'
      },

      /**
       * Path to an item sub-property whose value gets displayed in the column body cells.
       * The property name is also shown in the column header if an explicit header or renderer isn't defined.
       */
      path: {
        type: String
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
        value: false
      },

      /**
       * @type {Array<!HTMLElement>}
       * @protected
       */
      _cells: Array
    };
  }
}

customElements.define(GridColumn.is, GridColumn);

export { GridColumn };
