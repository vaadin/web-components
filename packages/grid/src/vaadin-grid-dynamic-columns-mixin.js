/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

/**
 * @polymerMixin
 */
export const DynamicColumnsMixin = (superClass) =>
  class DynamicColumnsMixin extends superClass {
    static get properties() {
      return {
        /**
         * @protected
         */
        _columnTree: Object
      };
    }

    /** @protected */
    ready() {
      super.ready();
      this._addNodeObserver();
    }

    /** @private */
    _hasColumnGroups(columns) {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].localName === 'vaadin-grid-column-group') {
          return true;
        }
      }

      return false;
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
    _flattenColumnGroups(columns) {
      return columns
        .map((col) => {
          if (col.localName === 'vaadin-grid-column-group') {
            return this._getChildColumns(col);
          }
          return [col];
        })
        .reduce((prev, curr) => {
          return prev.concat(curr);
        }, []);
    }

    /** @private */
    _getColumnTree() {
      const rootColumns = FlattenedNodesObserver.getFlattenedNodes(this).filter(this._isColumnElement);
      const columnTree = [rootColumns];

      let c = rootColumns;
      while (this._hasColumnGroups(c)) {
        c = this._flattenColumnGroups(c);
        columnTree.push(c);
      }

      return columnTree;
    }

    /** @protected */
    _updateColumnTree() {
      const columnTree = this._getColumnTree();
      if (!this._arrayEquals(columnTree, this._columnTree)) {
        this._columnTree = columnTree;
      }
    }

    /** @private */
    _addNodeObserver() {
      this._observer = new FlattenedNodesObserver(this, (info) => {
        const hasColumnElements = (nodeCollection) => nodeCollection.filter(this._isColumnElement).length > 0;
        if (hasColumnElements(info.addedNodes) || hasColumnElements(info.removedNodes)) {
          const allRemovedCells = info.removedNodes.flatMap((c) => c._allCells);
          const filterNotConnected = (element) =>
            allRemovedCells.filter((cell) => cell._content.contains(element)).length;

          this.__removeSorters(this._sorters.filter(filterNotConnected));
          this.__removeFilters(this._filters.filter(filterNotConnected));
          this._updateColumnTree();
        }

        this._debouncerCheckImports = Debouncer.debounce(
          this._debouncerCheckImports,
          timeOut.after(2000),
          this._checkImports.bind(this)
        );

        this._ensureFirstPageLoaded();
      });
    }

    /** @private */
    _arrayEquals(arr1, arr2) {
      if (!arr1 || !arr2 || arr1.length != arr2.length) {
        return false;
      }

      for (let i = 0, l = arr1.length; i < l; i++) {
        // Check if we have nested arrays
        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
          // recurse into the nested arrays
          if (!this._arrayEquals(arr1[i], arr2[i])) {
            return false;
          }
        } else if (arr1[i] != arr2[i]) {
          return false;
        }
      }
      return true;
    }

    /** @protected */
    _checkImports() {
      [
        'vaadin-grid-column-group',
        'vaadin-grid-filter',
        'vaadin-grid-filter-column',
        'vaadin-grid-tree-toggle',
        'vaadin-grid-selection-column',
        'vaadin-grid-sort-column',
        'vaadin-grid-sorter'
      ].forEach((elementName) => {
        const element = this.querySelector(elementName);
        if (element && !(element instanceof PolymerElement)) {
          console.warn(`Make sure you have imported the required module for <${elementName}> element.`);
        }
      });
    }

    /** @protected */
    _updateFirstAndLastColumn() {
      Array.from(this.shadowRoot.querySelectorAll('tr')).forEach((row) => this._updateFirstAndLastColumnForRow(row));
    }

    /**
     * @param {!HTMLElement} row
     * @protected
     */
    _updateFirstAndLastColumnForRow(row) {
      Array.from(row.querySelectorAll('[part~="cell"]:not([part~="details-cell"])'))
        .sort((a, b) => {
          return a._column._order - b._column._order;
        })
        .forEach((cell, cellIndex, children) => {
          cell.toggleAttribute('first-column', cellIndex === 0);
          cell.toggleAttribute('last-column', cellIndex === children.length - 1);
        });
    }

    /**
     * @param {!Node} node
     * @return {boolean}
     * @protected
     */
    _isColumnElement(node) {
      return node.nodeType === Node.ELEMENT_NODE && /\bcolumn\b/.test(node.localName);
    }
  };
