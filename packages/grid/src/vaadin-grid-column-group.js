/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { animationFrame, microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
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
        value() {
          return this._getChildColumns(this);
        },
      },

      /**
       * Flex grow ratio for the column group as the sum of the ratios of its child columns.
       * @attr {number} flex-grow
       */
      flexGrow: {
        type: Number,
        readOnly: true,
      },

      /**
       * Width of the column group as the sum of the widths of its child columns.
       */
      width: {
        type: String,
        readOnly: true,
      },

      /** @private */
      _visibleChildColumns: Array,

      /** @private */
      _colSpan: Number,

      /** @private */
      _rootColumns: Array,
    };
  }

  static get observers() {
    return [
      '_groupFrozenChanged(frozen, _rootColumns)',
      '_groupFrozenToEndChanged(frozenToEnd, _rootColumns)',
      '_groupHiddenChanged(hidden)',
      '_colSpanChanged(_colSpan, _headerCell, _footerCell)',
      '_groupOrderChanged(_order, _rootColumns)',
      '_groupReorderStatusChanged(_reorderStatus, _rootColumns)',
      '_groupResizableChanged(resizable, _rootColumns)',
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
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  /**
   * @param {string} path
   * @param {unknown=} value
   * @protected
   */
  _columnPropChanged(path, value) {
    if (path === 'hidden') {
      // Prevent synchronization of the hidden state to child columns.
      // If the group is currently auto-hidden, and one column is made visible,
      // we don't want the other columns to become visible as well.
      this._preventHiddenSynchronization = true;
      this._updateVisibleChildColumns(this._childColumns);
      this._preventHiddenSynchronization = false;
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

    if (path === 'frozenToEnd') {
      // Don’t unfreeze the frozen group because of a non-frozen child
      this.frozenToEnd = this.frozenToEnd || value;
    }

    if (path === 'firstFrozenToEnd') {
      // Don’t unfreeze the frozen group because of a non-frozen child
      this._firstFrozenToEnd = this._firstFrozenToEnd || value;
    }
  }

  /** @private */
  _groupOrderChanged(order, rootColumns) {
    if (rootColumns) {
      const _rootColumns = rootColumns.slice(0);

      if (!order) {
        _rootColumns.forEach((column) => {
          column._order = 0;
        });
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
      const scope = 10 ** (trailingZeros - childCountDigits);

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

    rootColumns.forEach((column) => {
      column._reorderStatus = reorderStatus;
    });
  }

  /** @private */
  _groupResizableChanged(resizable, rootColumns) {
    if (resizable === undefined || rootColumns === undefined) {
      return;
    }

    rootColumns.forEach((column) => {
      column.resizable = resizable;
    });
  }

  /** @private */
  _updateVisibleChildColumns(childColumns) {
    this._visibleChildColumns = Array.prototype.filter.call(childColumns, (col) => !col.hidden);
    this._colSpan = this._visibleChildColumns.length;
    this._updateAutoHidden();
  }

  /** @protected */
  _updateFlexAndWidth() {
    if (!this._visibleChildColumns) {
      return;
    }

    if (this._visibleChildColumns.length > 0) {
      const width = this._visibleChildColumns
        .reduce((prev, curr) => {
          prev += ` + ${(curr.width || '0px').replace('calc', '')}`;
          return prev;
        }, '')
        .substring(3);
      this._setWidth(`calc(${width})`);
    } else {
      this._setWidth('0px');
    }

    this._setFlexGrow(Array.prototype.reduce.call(this._visibleChildColumns, (prev, curr) => prev + curr.flexGrow, 0));
  }

  /**
   * This method is called before the group's frozen value is being propagated to the child columns.
   * In case some of the child columns are frozen, while others are not, the non-frozen ones
   * will get automatically frozen as well. As this may sometimes be unintended, this method
   * shows a warning in the console in such cases.
   * @private
   */
  __scheduleAutoFreezeWarning(columns, frozenProp) {
    if (this._grid) {
      // Derive the attribute name from the property name
      const frozenAttr = frozenProp.replace(/([A-Z])/g, '-$1').toLowerCase();

      // Check if all the columns have the same frozen value
      const firstColumnFrozen = columns[0][frozenProp] || columns[0].hasAttribute(frozenAttr);
      const allSameFrozen = columns.every((column) => {
        return (column[frozenProp] || column.hasAttribute(frozenAttr)) === firstColumnFrozen;
      });

      if (!allSameFrozen) {
        // Some of the child columns are frozen, some are not. Show a warning.
        this._grid.__autoFreezeWarningDebouncer = Debouncer.debounce(
          this._grid.__autoFreezeWarningDebouncer,
          animationFrame,
          () => {
            console.warn(
              `WARNING: Joining ${frozenProp} and non-${frozenProp} Grid columns inside the same column group! ` +
                `This will automatically freeze all the joined columns to avoid rendering issues. ` +
                `If this was intentional, consider marking each joined column explicitly as ${frozenProp}. ` +
                `Otherwise, exclude the ${frozenProp} columns from the joined group.`,
            );
          },
        );
      }
    }
  }

  /** @private */
  _groupFrozenChanged(frozen, rootColumns) {
    if (rootColumns === undefined || frozen === undefined) {
      return;
    }

    // Don’t propagate the default `false` value.
    if (frozen !== false) {
      this.__scheduleAutoFreezeWarning(rootColumns, 'frozen');

      Array.from(rootColumns).forEach((col) => {
        col.frozen = frozen;
      });
    }
  }

  /** @private */
  _groupFrozenToEndChanged(frozenToEnd, rootColumns) {
    if (rootColumns === undefined || frozenToEnd === undefined) {
      return;
    }

    // Don’t propagate the default `false` value.
    if (frozenToEnd !== false) {
      this.__scheduleAutoFreezeWarning(rootColumns, 'frozenToEnd');

      Array.from(rootColumns).forEach((col) => {
        col.frozenToEnd = frozenToEnd;
      });
    }
  }

  /** @private */
  _groupHiddenChanged(hidden) {
    // When initializing the hidden property, only sync hidden state to columns
    // if group is actually hidden. Otherwise, we could override a hidden column
    // to be visible.
    // We always want to run this though if the property is actually changed.
    if (hidden || this.__groupHiddenInitialized) {
      this._synchronizeHidden();
    }
    this.__groupHiddenInitialized = true;
  }

  /** @private */
  _updateAutoHidden() {
    const wasAutoHidden = this._autoHidden;
    this._autoHidden = (this._visibleChildColumns || []).length === 0;
    // Only modify hidden state if group was auto-hidden, or becomes auto-hidden
    if (wasAutoHidden || this._autoHidden) {
      this.hidden = this._autoHidden;
    }
  }

  /** @private */
  _synchronizeHidden() {
    if (this._childColumns && !this._preventHiddenSynchronization) {
      this._childColumns.forEach((column) => {
        column.hidden = this.hidden;
      });
    }
  }

  /** @private */
  _colSpanChanged(colSpan, headerCell, footerCell) {
    if (headerCell) {
      headerCell.setAttribute('colspan', colSpan);
      if (this._grid) {
        this._grid._a11yUpdateCellColspan(headerCell, colSpan);
      }
    }
    if (footerCell) {
      footerCell.setAttribute('colspan', colSpan);
      if (this._grid) {
        this._grid._a11yUpdateCellColspan(footerCell, colSpan);
      }
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
        // Prevent synchronization of the hidden state to child columns.
        // If the group is currently auto-hidden, and a visible column is added,
        // we don't want the other columns to become visible as well.
        this._preventHiddenSynchronization = true;
        this._rootColumns = this._getChildColumns(this);
        this._childColumns = this._rootColumns;
        this._updateVisibleChildColumns(this._childColumns);
        this._preventHiddenSynchronization = false;

        // Update the column tree with microtask timing to avoid shady style scope issues
        microTask.run(() => {
          if (this._grid && this._grid._updateColumnTree) {
            this._grid._updateColumnTree();
          }
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
