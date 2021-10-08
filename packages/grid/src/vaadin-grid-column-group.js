/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { ColumnBaseMixin } from './vaadin-grid-column.js';
import { updateColumnOrders } from './vaadin-grid-helpers.js';

/**
 * A `<vaadin-grid-column-group>` is used to make groups of columns in `<vaadin-grid>` and
 * to configure additional headers and footers.
 *
 * Groups can be nested to create complex header and footer configurations.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column-group resizable id="columnGroup">
 *   <vaadin-grid-column id="column1"></vaadin-grid-column>
 *   <vaadin-grid-column id="column2"></vaadin-grid-column>
 * </vaadin-grid-column-group>
 * ```
 *
 * ```js
 * const columnGroup = document.querySelector('#columnGroup');
 * columnGroup.headerRenderer = (root, columnGroup) => {
 *   root.textContent = 'header';
 * }
 *
 * const column1 = document.querySelector('#column1');
 * column1.headerRenderer = (root, column) => { ... };
 * column1.renderer = (root, column, model) => { ... };
 *
 * const column2 = document.querySelector('#column2');
 * column2.headerRenderer = (root, column) => { ... };
 * column2.renderer = (root, column, model) => { ... };
 * ```
 *
 * @extends HTMLElement
 * @mixes ColumnBaseMixin
 */
class GridColumnGroup extends ColumnBaseMixin(PolymerElement) {
  static get is() {
    return 'vaadin-grid-column-group';
  }

  static get properties() {
    return {
      /** @private */
      _childColumns: {
        value: function () {
          return this._getChildColumns(this);
        }
      },

      /**
       * Flex grow ratio for the column group as the sum of the ratios of its child columns.
       * @attr {number} flex-grow
       */
      flexGrow: {
        type: Number,
        readOnly: true
      },

      /**
       * Width of the column group as the sum of the widths of its child columns.
       */
      width: {
        type: String,
        readOnly: true
      },

      /** @private */
      _visibleChildColumns: Array,

      /** @private */
      _colSpan: Number,

      /** @private */
      _rootColumns: Array
    };
  }

  static get observers() {
    return [
      '_updateVisibleChildColumns(_childColumns)',
      '_childColumnsChanged(_childColumns)',
      '_groupFrozenChanged(frozen, _rootColumns)',
      '_groupHiddenChanged(hidden, _rootColumns)',
      '_visibleChildColumnsChanged(_visibleChildColumns)',
      '_colSpanChanged(_colSpan, _headerCell, _footerCell)',
      '_groupOrderChanged(_order, _rootColumns)',
      '_groupReorderStatusChanged(_reorderStatus, _rootColumns)',
      '_groupResizableChanged(resizable, _rootColumns)'
    ];
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this._addNodeObserver();
    this._updateFlexAndWidth();
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer && this._observer.disconnect();
  }

  /**
   * @param {string} path
   * @param {unknown=} value
   * @protected
   */
  _columnPropChanged(path, value) {
    if (path === 'hidden') {
      this._preventHiddenCascade = true;
      this._updateVisibleChildColumns(this._childColumns);
      this._preventHiddenCascade = false;
    }

    if (/flexGrow|width|hidden|_childColumns/.test(path)) {
      this._updateFlexAndWidth();
    }

    if (path === 'frozen') {
      // Don’t unfreeze the frozen group because of a non-frozen child
      this.frozen = this.frozen || value;
    }

    if (path === 'lastFrozen') {
      // Don’t unfreeze the frozen group because of a non-frozen child
      this._lastFrozen = this._lastFrozen || value;
    }
  }

  /** @private */
  _groupOrderChanged(order, rootColumns) {
    if (rootColumns) {
      const _rootColumns = rootColumns.slice(0);

      if (!order) {
        _rootColumns.forEach((column) => (column._order = 0));
        return;
      }
      // The parent column order number cascades downwards to it's children
      // so that the resulting order numbering constructs as follows:
      // [             1000              ]
      // [     1100    ] | [     1200    ]
      // [1110] | [1120] | [1210] | [1220]

      // Trailing zeros are counted so we know the level on which we're working on.
      const trailingZeros = /(0+)$/.exec(order).pop().length;

      // In an unlikely situation where a group has more than 9 child columns,
      // the child scope must have 1 digit less...
      // Log^a_b = Ln(a)/Ln(b)
      // Number of digits of a number is equal to floor(Log(number)_10) + 1
      const childCountDigits = ~~(Math.log(rootColumns.length) / Math.LN10) + 1;

      // Final scope for the child columns needs to mind both factors.
      const scope = Math.pow(10, trailingZeros - childCountDigits);

      if (_rootColumns[0] && _rootColumns[0]._order) {
        _rootColumns.sort((a, b) => a._order - b._order);
      }
      updateColumnOrders(_rootColumns, scope, order);
    }
  }

  /** @private */
  _groupReorderStatusChanged(reorderStatus, rootColumns) {
    if (reorderStatus === undefined || rootColumns === undefined) {
      return;
    }

    rootColumns.forEach((column) => (column._reorderStatus = reorderStatus));
  }

  /** @private */
  _groupResizableChanged(resizable, rootColumns) {
    if (resizable === undefined || rootColumns === undefined) {
      return;
    }

    rootColumns.forEach((column) => (column.resizable = resizable));
  }

  /** @private */
  _updateVisibleChildColumns(childColumns) {
    this._visibleChildColumns = Array.prototype.filter.call(childColumns, (col) => !col.hidden);
  }

  /** @private */
  _childColumnsChanged(childColumns) {
    if (!this._autoHidden && this.hidden) {
      Array.prototype.forEach.call(childColumns, (column) => (column.hidden = true));
      this._updateVisibleChildColumns(childColumns);
    }
  }

  /** @protected */
  _updateFlexAndWidth() {
    if (!this._visibleChildColumns) {
      return;
    }

    if (this._visibleChildColumns.length) {
      this._setWidth(
        'calc(' +
          Array.prototype.reduce
            .call(
              this._visibleChildColumns,
              (prev, curr) => (prev += ' + ' + (curr.width || '0px').replace('calc', '')),
              ''
            )
            .substring(3) +
          ')'
      );
    } else {
      this._setWidth('0px');
    }

    this._setFlexGrow(Array.prototype.reduce.call(this._visibleChildColumns, (prev, curr) => prev + curr.flexGrow, 0));
  }

  /** @private */
  _groupFrozenChanged(frozen, rootColumns) {
    if (rootColumns === undefined || frozen === undefined) {
      return;
    }

    // Don’t propagate the default `false` value.
    if (frozen !== false) {
      Array.from(rootColumns).forEach((col) => (col.frozen = frozen));
    }
  }

  /** @private */
  _groupHiddenChanged(hidden, rootColumns) {
    if (rootColumns && !this._preventHiddenCascade) {
      this._ignoreVisibleChildColumns = true;
      rootColumns.forEach((column) => (column.hidden = hidden));
      this._ignoreVisibleChildColumns = false;
    }

    this._columnPropChanged('hidden');
  }

  /** @private */
  _visibleChildColumnsChanged(visibleChildColumns) {
    this._colSpan = visibleChildColumns.length;

    if (!this._ignoreVisibleChildColumns) {
      if (visibleChildColumns.length === 0) {
        this._autoHidden = this.hidden = true;
      } else if (this.hidden && this._autoHidden) {
        this._autoHidden = this.hidden = false;
      }
    }
  }

  /** @private */
  _colSpanChanged(colSpan, headerCell, footerCell) {
    if (headerCell) {
      headerCell.setAttribute('colspan', colSpan);
      this._grid && this._grid._a11yUpdateCellColspan(headerCell, colSpan);
    }
    if (footerCell) {
      footerCell.setAttribute('colspan', colSpan);
      this._grid && this._grid._a11yUpdateCellColspan(footerCell, colSpan);
    }
  }

  /**
   * @param {!GridColumnGroup} el
   * @return {!Array<!GridColumn>}
   * @protected
   */
  _getChildColumns(el) {
    return FlattenedNodesObserver.getFlattenedNodes(el).filter(this._isColumnElement);
  }

  /** @private */
  _addNodeObserver() {
    this._observer = new FlattenedNodesObserver(this, (info) => {
      if (
        info.addedNodes.filter(this._isColumnElement).length > 0 ||
        info.removedNodes.filter(this._isColumnElement).length > 0
      ) {
        this._preventHiddenCascade = true;
        this._rootColumns = this._getChildColumns(this);
        this._childColumns = this._rootColumns;
        this._preventHiddenCascade = false;

        // Update the column tree with microtask timing to avoid shady style scope issues
        microTask.run(() => {
          this._grid && this._grid._updateColumnTree && this._grid._updateColumnTree();
        });
      }
    });
    this._observer.flush();
  }

  /**
   * @param {!Node} node
   * @return {boolean}
   * @protected
   */
  _isColumnElement(node) {
    return node.nodeType === Node.ELEMENT_NODE && /\bcolumn\b/.test(node.localName);
  }
}

customElements.define(GridColumnGroup.is, GridColumnGroup);

export { GridColumnGroup };
