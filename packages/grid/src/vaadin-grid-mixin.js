/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TabindexMixin } from '@vaadin/a11y-base/src/tabindex-mixin.js';
import { animationFrame, microTask } from '@vaadin/component-base/src/async.js';
import {
  isAndroid,
  isChrome,
  isFirefox,
  isIOS,
  isSafari,
  isTouch,
  supportsAdoptingStyleSheets,
} from '@vaadin/component-base/src/browser-utils.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { getClosestElement } from '@vaadin/component-base/src/dom-utils.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { Virtualizer } from '@vaadin/component-base/src/virtualizer.js';
import { A11yMixin } from './vaadin-grid-a11y-mixin.js';
import { ActiveItemMixin } from './vaadin-grid-active-item-mixin.js';
import { ArrayDataProviderMixin } from './vaadin-grid-array-data-provider-mixin.js';
import { ColumnAutoWidthMixin } from './vaadin-grid-column-auto-width-mixin.js';
import { ColumnReorderingMixin } from './vaadin-grid-column-reordering-mixin.js';
import { ColumnResizingMixin } from './vaadin-grid-column-resizing-mixin.js';
import { DataProviderMixin } from './vaadin-grid-data-provider-mixin.js';
import { DragAndDropMixin } from './vaadin-grid-drag-and-drop-mixin.js';
import { DynamicColumnsMixin } from './vaadin-grid-dynamic-columns-mixin.js';
import { EventContextMixin } from './vaadin-grid-event-context-mixin.js';
import { FilterMixin } from './vaadin-grid-filter-mixin.js';
import {
  getBodyRowCells,
  iterateChildren,
  iterateRowCells,
  updateBooleanRowStates,
  updateCellsPart,
} from './vaadin-grid-helpers.js';
import { KeyboardNavigationMixin } from './vaadin-grid-keyboard-navigation-mixin.js';
import { RowDetailsMixin } from './vaadin-grid-row-details-mixin.js';
import { ScrollMixin } from './vaadin-grid-scroll-mixin.js';
import { SelectionMixin } from './vaadin-grid-selection-mixin.js';
import { SortMixin } from './vaadin-grid-sort-mixin.js';
import { StylingMixin } from './vaadin-grid-styling-mixin.js';

/**
 * A mixin providing common grid functionality.
 *
 * @polymerMixin
 * @mixes A11yMixin
 * @mixes ActiveItemMixin
 * @mixes ArrayDataProviderMixin
 * @mixes ColumnResizingMixin
 * @mixes DataProviderMixin
 * @mixes DynamicColumnsMixin
 * @mixes FilterMixin
 * @mixes RowDetailsMixin
 * @mixes ScrollMixin
 * @mixes SelectionMixin
 * @mixes SortMixin
 * @mixes KeyboardNavigationMixin
 * @mixes ColumnReorderingMixin
 * @mixes EventContextMixin
 * @mixes StylingMixin
 * @mixes DragAndDropMixin
 */
export const GridMixin = (superClass) =>
  class extends ArrayDataProviderMixin(
    DataProviderMixin(
      DynamicColumnsMixin(
        ActiveItemMixin(
          ScrollMixin(
            SelectionMixin(
              SortMixin(
                RowDetailsMixin(
                  KeyboardNavigationMixin(
                    A11yMixin(
                      FilterMixin(
                        ColumnReorderingMixin(
                          ColumnResizingMixin(
                            EventContextMixin(
                              DragAndDropMixin(ColumnAutoWidthMixin(StylingMixin(TabindexMixin(superClass)))),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ) {
    static get observers() {
      return ['_columnTreeChanged(_columnTree)', '_flatSizeChanged(_flatSize, __virtualizer, _hasData, _columnTree)'];
    }

    static get properties() {
      return {
        /** @private */
        _safari: {
          type: Boolean,
          value: isSafari,
        },

        /** @private */
        _ios: {
          type: Boolean,
          value: isIOS,
        },

        /** @private */
        _firefox: {
          type: Boolean,
          value: isFirefox,
        },

        /** @private */
        _android: {
          type: Boolean,
          value: isAndroid,
        },

        /** @private */
        _touchDevice: {
          type: Boolean,
          value: isTouch,
        },

        /**
         * If true, the grid's height is defined by its rows.
         *
         * Effectively, this disables the grid's virtual scrolling so that all the rows are rendered in the DOM at once.
         * If the grid has a large number of items, using the feature is discouraged to avoid performance issues.
         * @attr {boolean} all-rows-visible
         * @type {boolean}
         */
        allRowsVisible: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /** @private */
        isAttached: {
          value: false,
        },

        /**
         * An internal property that is mainly used by `vaadin-template-renderer`
         * to identify grid elements.
         *
         * @private
         */
        __gridElement: {
          type: Boolean,
          value: true,
        },

        /** @private */
        __hasEmptyStateContent: {
          type: Boolean,
          value: false,
        },

        /** @private */
        __emptyState: {
          type: Boolean,
          computed: '__computeEmptyState(_flatSize, __hasEmptyStateContent)',
        },
      };
    }

    constructor() {
      super();
      this.addEventListener('animationend', this._onAnimationEnd);
    }

    /** @private */
    get _firstVisibleIndex() {
      const firstVisibleItem = this.__getFirstVisibleItem();
      return firstVisibleItem ? firstVisibleItem.index : undefined;
    }

    /** @private */
    get _lastVisibleIndex() {
      const lastVisibleItem = this.__getLastVisibleItem();
      return lastVisibleItem ? lastVisibleItem.index : undefined;
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      this.isAttached = true;
      this.recalculateColumnWidths();
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.isAttached = false;
      this._hideTooltip(true);
    }

    /** @private */
    __getFirstVisibleItem() {
      return this._getRenderedRows().find((row) => this._isInViewport(row));
    }

    /** @private */
    __getLastVisibleItem() {
      return this._getRenderedRows()
        .reverse()
        .find((row) => this._isInViewport(row));
    }

    /** @private */
    _isInViewport(item) {
      const scrollTargetRect = this.$.table.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const headerHeight = this.$.header.getBoundingClientRect().height;
      const footerHeight = this.$.footer.getBoundingClientRect().height;
      return (
        itemRect.bottom > scrollTargetRect.top + headerHeight && itemRect.top < scrollTargetRect.bottom - footerHeight
      );
    }

    /** @private */
    _getRenderedRows() {
      return Array.from(this.$.items.children)
        .filter((item) => !item.hidden)
        .sort((a, b) => a.index - b.index);
    }

    /** @protected */
    _getRowContainingNode(node) {
      const content = getClosestElement('vaadin-grid-cell-content', node);
      if (!content) {
        return;
      }

      const cell = content.assignedSlot.parentElement;
      return cell.parentElement;
    }

    /** @protected */
    _isItemAssignedToRow(item, row) {
      const model = this.__getRowModel(row);
      return this.getItemId(item) === this.getItemId(model.item);
    }

    /** @protected */
    ready() {
      super.ready();

      this.__virtualizer = new Virtualizer({
        createElements: this._createScrollerRows.bind(this),
        updateElement: this._updateScrollerItem.bind(this),
        scrollContainer: this.$.items,
        scrollTarget: this.$.table,
        reorderElements: true,
      });

      new ResizeObserver(() =>
        setTimeout(() => {
          this.__updateColumnsBodyContentHidden();
          this.__tryToRecalculateColumnWidthsIfPending();
        }),
      ).observe(this.$.table);

      const minHeightObserver = new ResizeObserver(() =>
        setTimeout(() => {
          this.__updateMinHeight();
        }),
      );

      minHeightObserver.observe(this.$.header);
      minHeightObserver.observe(this.$.items);
      minHeightObserver.observe(this.$.footer);

      processTemplates(this);

      this._tooltipController = new TooltipController(this);
      this.addController(this._tooltipController);
      this._tooltipController.setManual(true);

      this.__emptyStateContentObserver = new SlotObserver(this.$.emptystateslot, ({ currentNodes }) => {
        this.$.emptystatecell._content = currentNodes[0];
        this.__hasEmptyStateContent = !!this.$.emptystatecell._content;
      });
    }

    /** @private */
    __getBodyCellCoordinates(cell) {
      if (this.$.items.contains(cell) && cell.localName === 'td') {
        return {
          item: cell.parentElement._item,
          column: cell._column,
        };
      }
    }

    /** @private */
    __focusBodyCell({ item, column }) {
      const row = this._getRenderedRows().find((row) => row._item === item);
      const cell = row && [...row.children].find((cell) => cell._column === column);
      if (cell) {
        cell.focus();
      }
    }

    /** @protected */
    _focusFirstVisibleRow() {
      const row = this.__getFirstVisibleItem();
      this.__rowFocusMode = true;
      row.focus();
    }

    /** @private */
    _flatSizeChanged(flatSize, virtualizer, hasData, columnTree) {
      if (virtualizer && hasData && columnTree) {
        // Changing the virtualizer size may result in the row with focus getting hidden
        const cell = this.shadowRoot.activeElement;
        const cellCoordinates = this.__getBodyCellCoordinates(cell);

        const previousSize = virtualizer.size || 0;
        virtualizer.size = flatSize;

        // Request an update for the previous last row to have the "last" state removed
        virtualizer.update(previousSize - 1, previousSize - 1);
        if (flatSize < previousSize) {
          // Size was decreased, so the new last row requires an explicit update
          virtualizer.update(flatSize - 1, flatSize - 1);
        }

        // If the focused cell's parent row got hidden by the size change, focus the corresponding new cell
        if (cellCoordinates && cell.parentElement.hidden) {
          this.__focusBodyCell(cellCoordinates);
        }

        // Make sure the body has a tabbable element
        this._resetKeyboardNavigation();
      }
    }

    /**
     * @protected
     * @override
     */
    _onDataProviderPageLoaded() {
      super._onDataProviderPageLoaded();
      this.__tryToRecalculateColumnWidthsIfPending();
    }

    /** @private */
    _createScrollerRows(count) {
      const rows = [];
      for (let i = 0; i < count; i++) {
        const row = document.createElement('tr');
        row.setAttribute('part', 'row body-row');
        row.setAttribute('role', 'row');
        row.setAttribute('tabindex', '-1');
        if (this._columnTree) {
          this._updateRow(row, this._columnTree[this._columnTree.length - 1], 'body', false, true);
        }
        rows.push(row);
      }

      if (this._columnTree) {
        this._columnTree[this._columnTree.length - 1].forEach((c) => {
          if (c.isConnected && c._cells) {
            c._cells = [...c._cells];
          }
        });
      }

      this.__afterCreateScrollerRowsDebouncer = Debouncer.debounce(
        this.__afterCreateScrollerRowsDebouncer,
        animationFrame,
        () => {
          this._afterScroll();
          this.__tryToRecalculateColumnWidthsIfPending();
        },
      );
      return rows;
    }

    /** @private */
    _createCell(tagName, column) {
      const contentId = (this._contentIndex = this._contentIndex + 1 || 0);
      const slotName = `vaadin-grid-cell-content-${contentId}`;

      const cellContent = document.createElement('vaadin-grid-cell-content');
      cellContent.setAttribute('slot', slotName);

      const cell = document.createElement(tagName);
      cell.id = slotName.replace('-content-', '-');
      cell.setAttribute('role', tagName === 'td' ? 'gridcell' : 'columnheader');

      // For now we only support tooltip on desktop
      if (!isAndroid && !isIOS) {
        cell.addEventListener('mouseenter', (event) => {
          if (!this.$.scroller.hasAttribute('scrolling')) {
            this._showTooltip(event);
          }
        });

        cell.addEventListener('mouseleave', () => {
          this._hideTooltip();
        });

        cell.addEventListener('mousedown', () => {
          this._hideTooltip(true);
        });
      }

      const slot = document.createElement('slot');
      slot.setAttribute('name', slotName);

      if (column && column._focusButtonMode) {
        const div = document.createElement('div');
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '-1');
        cell.appendChild(div);

        // Patch `focus()` to use the button
        cell._focusButton = div;
        cell.focus = function (options) {
          cell._focusButton.focus(options);
        };

        div.appendChild(slot);
      } else {
        cell.setAttribute('tabindex', '-1');
        cell.appendChild(slot);
      }

      cell._content = cellContent;

      // With native Shadow DOM, mousedown on slotted element does not focus
      // focusable slot wrapper, that is why cells are not focused with
      // mousedown. Workaround: listen for mousedown and focus manually.
      cellContent.addEventListener('mousedown', () => {
        if (isChrome) {
          // Chrome bug: focusing before mouseup prevents text selection, see http://crbug.com/771903
          const mouseUpListener = (event) => {
            // If focus is on element within the cell content - respect it, do not change
            const contentContainsFocusedElement = cellContent.contains(this.getRootNode().activeElement);
            // Only focus if mouse is released on cell content itself
            const mouseUpWithinCell = event.composedPath().includes(cellContent);
            if (!contentContainsFocusedElement && mouseUpWithinCell) {
              cell.focus({ preventScroll: true });
            }
            document.removeEventListener('mouseup', mouseUpListener, true);
          };
          document.addEventListener('mouseup', mouseUpListener, true);
        } else {
          // Focus on mouseup, on the other hand, removes selection on Safari.
          // Watch out sync focus removal issue, only async focus works here.
          setTimeout(() => {
            if (!cellContent.contains(this.getRootNode().activeElement)) {
              cell.focus({ preventScroll: true });
            }
          });
        }
      });

      return cell;
    }

    /**
     * @param {!HTMLTableRowElement} row
     * @param {!Array<!GridColumn>} columns
     * @param {?string} section
     * @param {boolean} isColumnRow
     * @param {boolean} noNotify
     * @protected
     */
    _updateRow(row, columns, section = 'body', isColumnRow = false, noNotify = false) {
      const contentsFragment = document.createDocumentFragment();

      iterateRowCells(row, (cell) => {
        cell._vacant = true;
      });
      row.innerHTML = '';
      if (section === 'body') {
        // Clear the cached cell references
        row.__cells = [];
        row.__detailsCell = null;
      }

      columns
        .filter((column) => !column.hidden)
        .forEach((column, index, cols) => {
          let cell;

          if (section === 'body') {
            // Body
            if (!column._cells) {
              column._cells = [];
            }
            cell = column._cells.find((cell) => cell._vacant);
            if (!cell) {
              cell = this._createCell('td', column);
              if (column._onCellKeyDown) {
                cell.addEventListener('keydown', column._onCellKeyDown.bind(column));
              }
              column._cells.push(cell);
            }
            cell.setAttribute('part', 'cell body-cell');
            cell.__parentRow = row;
            // Cache the cell reference
            row.__cells.push(cell);

            const isSizerRow = row === this.$.sizer;
            if (!column._bodyContentHidden || isSizerRow) {
              row.appendChild(cell);
            }

            if (isSizerRow) {
              column._sizerCell = cell;
            }

            if (index === cols.length - 1 && this.rowDetailsRenderer) {
              // Add details cell as last cell to body rows
              if (!this._detailsCells) {
                this._detailsCells = [];
              }
              const detailsCell = this._detailsCells.find((cell) => cell._vacant) || this._createCell('td');
              if (this._detailsCells.indexOf(detailsCell) === -1) {
                this._detailsCells.push(detailsCell);
              }
              if (!detailsCell._content.parentElement) {
                contentsFragment.appendChild(detailsCell._content);
              }
              this._configureDetailsCell(detailsCell);
              row.appendChild(detailsCell);
              // Cache the details cell reference
              row.__detailsCell = detailsCell;
              this._a11ySetRowDetailsCell(row, detailsCell);
              detailsCell._vacant = false;
            }

            if (!noNotify) {
              column._cells = [...column._cells];
            }
          } else {
            // Header & footer
            const tagName = section === 'header' ? 'th' : 'td';
            if (isColumnRow || column.localName === 'vaadin-grid-column-group') {
              cell = column[`_${section}Cell`];
              if (!cell) {
                cell = this._createCell(tagName);
                if (column._onCellKeyDown) {
                  cell.addEventListener('keydown', column._onCellKeyDown.bind(column));
                }
              }
              cell._column = column;
              row.appendChild(cell);
              column[`_${section}Cell`] = cell;
            } else {
              if (!column._emptyCells) {
                column._emptyCells = [];
              }
              cell = column._emptyCells.find((cell) => cell._vacant) || this._createCell(tagName);
              cell._column = column;
              row.appendChild(cell);
              if (column._emptyCells.indexOf(cell) === -1) {
                column._emptyCells.push(cell);
              }
            }
            cell.part.add('cell', `${section}-cell`);
          }

          if (!cell._content.parentElement) {
            contentsFragment.appendChild(cell._content);
          }
          cell._vacant = false;
          cell._column = column;
        });

      if (section !== 'body') {
        this.__debounceUpdateHeaderFooterRowVisibility(row);
      }

      // Might be empty if only cache was used
      this.appendChild(contentsFragment);

      this._frozenCellsChanged();
      this._updateFirstAndLastColumnForRow(row);
    }

    /**
     * @param {HTMLTableRowElement} row
     * @protected
     */
    __debounceUpdateHeaderFooterRowVisibility(row) {
      row.__debounceUpdateHeaderFooterRowVisibility = Debouncer.debounce(
        row.__debounceUpdateHeaderFooterRowVisibility,
        microTask,
        () => this.__updateHeaderFooterRowVisibility(row),
      );
    }

    /**
     * @param {HTMLTableRowElement} row
     * @protected
     */
    __updateHeaderFooterRowVisibility(row) {
      if (!row) {
        return;
      }

      const visibleRowCells = Array.from(row.children).filter((cell) => {
        const column = cell._column;
        if (column._emptyCells && column._emptyCells.indexOf(cell) > -1) {
          // The cell is an "empty cell"  -> doesn't block hiding the row
          return false;
        }
        if (row.parentElement === this.$.header) {
          if (column.headerRenderer) {
            // The cell is the header cell of a column that has a header renderer
            // -> row should be visible
            return true;
          }
          if (column.header === null) {
            // The column header is explicilty set to null -> doesn't block hiding the row
            return false;
          }
          if (column.path || column.header !== undefined) {
            // The column has an explicit non-null header or a path that generates a header
            // -> row should be visible
            return true;
          }
        } else if (column.footerRenderer) {
          // The cell is the footer cell of a column that has a footer renderer
          // -> row should be visible
          return true;
        }
        return false;
      });

      if (row.hidden !== !visibleRowCells.length) {
        row.hidden = !visibleRowCells.length;
      }

      // Make sure the section has a tabbable element
      this._resetKeyboardNavigation();
    }

    /** @private */
    _updateScrollerItem(row, index) {
      this._preventScrollerRotatingCellFocus(row, index);

      if (!this._columnTree) {
        return;
      }

      this._updateRowOrderParts(row, index);

      this._a11yUpdateRowRowindex(row, index);
      this._getItem(index, row);
    }

    /** @private */
    _columnTreeChanged(columnTree) {
      this._renderColumnTree(columnTree);
      this.recalculateColumnWidths();
      this.__updateColumnsBodyContentHidden();
    }

    /** @private */
    _updateRowOrderParts(row, index = row.index) {
      updateBooleanRowStates(row, {
        first: index === 0,
        last: index === this._flatSize - 1,
        odd: index % 2 !== 0,
        even: index % 2 === 0,
      });
    }

    /** @private */
    _updateRowStateParts(row, { item, expanded, selected, detailsOpened }) {
      updateBooleanRowStates(row, {
        expanded,
        collapsed: this.__isRowExpandable(row),
        selected,
        nonselectable: this.__isItemSelectable(item) === false,
        'details-opened': detailsOpened,
      });
    }

    /** @private */
    __computeEmptyState(flatSize, hasEmptyStateContent) {
      return flatSize === 0 && hasEmptyStateContent;
    }

    /**
     * @param {!Array<!GridColumn>} columnTree
     * @protected
     */
    _renderColumnTree(columnTree) {
      iterateChildren(this.$.items, (row) => {
        this._updateRow(row, columnTree[columnTree.length - 1], 'body', false, true);

        const model = this.__getRowModel(row);
        this._updateRowOrderParts(row);
        this._updateRowStateParts(row, model);
        this._filterDragAndDrop(row, model);
      });

      while (this.$.header.children.length < columnTree.length) {
        const headerRow = document.createElement('tr');
        headerRow.setAttribute('part', 'row');
        headerRow.setAttribute('role', 'row');
        headerRow.setAttribute('tabindex', '-1');
        this.$.header.appendChild(headerRow);

        const footerRow = document.createElement('tr');
        footerRow.setAttribute('part', 'row');
        footerRow.setAttribute('role', 'row');
        footerRow.setAttribute('tabindex', '-1');
        this.$.footer.appendChild(footerRow);
      }
      while (this.$.header.children.length > columnTree.length) {
        this.$.header.removeChild(this.$.header.firstElementChild);
        this.$.footer.removeChild(this.$.footer.firstElementChild);
      }

      iterateChildren(this.$.header, (headerRow, index, rows) => {
        this._updateRow(headerRow, columnTree[index], 'header', index === columnTree.length - 1);

        const cells = getBodyRowCells(headerRow);
        updateCellsPart(cells, 'first-header-row-cell', index === 0);
        updateCellsPart(cells, 'last-header-row-cell', index === rows.length - 1);
      });

      iterateChildren(this.$.footer, (footerRow, index, rows) => {
        this._updateRow(footerRow, columnTree[columnTree.length - 1 - index], 'footer', index === 0);

        const cells = getBodyRowCells(footerRow);
        updateCellsPart(cells, 'first-footer-row-cell', index === 0);
        updateCellsPart(cells, 'last-footer-row-cell', index === rows.length - 1);
      });

      // Sizer rows
      this._updateRow(this.$.sizer, columnTree[columnTree.length - 1]);

      this._resizeHandler();
      this._frozenCellsChanged();
      this._updateFirstAndLastColumn();
      this._resetKeyboardNavigation();
      this._a11yUpdateHeaderRows();
      this._a11yUpdateFooterRows();
      this.generateCellClassNames();
      this.generateCellPartNames();
      this.__updateHeaderAndFooter();
    }

    /**
     * @param {!HTMLElement} row
     * @param {GridItem} item
     * @protected
     */
    _updateItem(row, item) {
      row._item = item;
      const model = this.__getRowModel(row);

      this._toggleDetailsCell(row, model.detailsOpened);

      this._a11yUpdateRowLevel(row, model.level);
      this._a11yUpdateRowSelected(row, model.selected);

      this._updateRowStateParts(row, model);

      this._generateCellClassNames(row, model);
      this._generateCellPartNames(row, model);
      this._filterDragAndDrop(row, model);
      this.__updateDragSourceParts(row, model);

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

      this._a11yUpdateRowExpanded(row, model.expanded);
    }

    /** @private */
    _resizeHandler() {
      this._updateDetailsCellHeights();
      this.__updateHorizontalScrollPosition();
    }

    /** @private */
    _onAnimationEnd(e) {
      // ShadyCSS applies scoping suffixes to animation names
      if (e.animationName.indexOf('vaadin-grid-appear') === 0) {
        e.stopPropagation();
        this.__tryToRecalculateColumnWidthsIfPending();

        // Ensure header and footer have tabbable elements
        this._resetKeyboardNavigation();

        requestAnimationFrame(() => {
          this.__scrollToPendingIndexes();
        });
      }
    }

    /**
     * @param {!HTMLTableRowElement} row
     * @return {!GridItemModel}
     * @protected
     */
    __getRowModel(row) {
      return {
        index: row.index,
        item: row._item,
        level: this._getIndexLevel(row.index),
        expanded: this._isExpanded(row._item),
        selected: this._isSelected(row._item),
        detailsOpened: !!this.rowDetailsRenderer && this._isDetailsOpened(row._item),
      };
    }

    /**
     * @param {Event} event
     * @protected
     */
    _showTooltip(event) {
      // Check if there is a slotted vaadin-tooltip element.
      const tooltip = this._tooltipController.node;
      if (tooltip && tooltip.isConnected) {
        const target = event.target;

        if (!this.__isCellFullyVisible(target)) {
          return;
        }

        this._tooltipController.setTarget(target);
        this._tooltipController.setContext(this.getEventContext(event));

        // Trigger opening using the corresponding delay.
        tooltip._stateController.open({
          focus: event.type === 'focusin',
          hover: event.type === 'mouseenter',
        });
      }
    }

    /** @private */
    __isCellFullyVisible(cell) {
      if (cell.hasAttribute('frozen') || cell.hasAttribute('frozen-to-end')) {
        // Frozen cells are always fully visible
        return true;
      }

      let { left, right } = this.getBoundingClientRect();

      const frozen = [...cell.parentNode.children].find((cell) => cell.hasAttribute('last-frozen'));
      if (frozen) {
        const frozenRect = frozen.getBoundingClientRect();
        left = this.__isRTL ? left : frozenRect.right;
        right = this.__isRTL ? frozenRect.left : right;
      }

      const frozenToEnd = [...cell.parentNode.children].find((cell) => cell.hasAttribute('first-frozen-to-end'));
      if (frozenToEnd) {
        const frozenToEndRect = frozenToEnd.getBoundingClientRect();
        left = this.__isRTL ? frozenToEndRect.right : left;
        right = this.__isRTL ? right : frozenToEndRect.left;
      }

      const cellRect = cell.getBoundingClientRect();
      return cellRect.left >= left && cellRect.right <= right;
    }

    /** @protected */
    _hideTooltip(immediate) {
      const tooltip = this._tooltipController && this._tooltipController.node;
      if (tooltip) {
        tooltip._stateController.close(immediate);
      }
    }

    /**
     * Requests an update for the content of cells.
     *
     * While performing the update, the following renderers are invoked:
     * - `Grid.rowDetailsRenderer`
     * - `GridColumn.renderer`
     * - `GridColumn.headerRenderer`
     * - `GridColumn.footerRenderer`
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      // Header and footer renderers
      this.__updateHeaderAndFooter();

      // Body and row details renderers
      this.__updateVisibleRows();
    }

    /** @private */
    __updateHeaderAndFooter() {
      (this._columnTree || []).forEach((level) => {
        level.forEach((column) => {
          if (column._renderHeaderAndFooter) {
            column._renderHeaderAndFooter();
          }
        });
      });
    }

    /** @protected */
    __updateVisibleRows(start, end) {
      if (this.__virtualizer) {
        this.__virtualizer.update(start, end);
      }
    }

    /** @private */
    __updateMinHeight() {
      // Min height is calculated based on the header, footer and a single row
      // For now use a hard-coded value for the row that matches a single default row in Lumo
      const rowHeight = 36;
      const headerHeight = this.$.header.clientHeight;
      const footerHeight = this.$.footer.clientHeight;
      const scrollbarHeight = this.$.table.offsetHeight - this.$.table.clientHeight;
      const minHeight = headerHeight + rowHeight + footerHeight + scrollbarHeight;

      // The style is set to host instead of the scroller so that the value can be overridden by the user with "grid { min-height: 0 }"
      // Prefer setting style in adopted style sheet to avoid the need to add a confusing inline style on the host element
      // If adopted style sheets are not supported, the style is set inline
      if (!this.__minHeightStyleSheet && supportsAdoptingStyleSheets) {
        this.__minHeightStyleSheet = new CSSStyleSheet();
        this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, this.__minHeightStyleSheet];
      }
      if (this.__minHeightStyleSheet) {
        this.__minHeightStyleSheet.replaceSync(`:host { --_grid-min-height: ${minHeight}px; }`);
      } else {
        this.style.setProperty('--_grid-min-height', `${minHeight}px`);
      }
    }
  };
