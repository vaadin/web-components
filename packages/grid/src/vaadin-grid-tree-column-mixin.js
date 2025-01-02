/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { get } from '@vaadin/component-base/src/path-utils.js';

/**
 * @polymerMixin
 */
export const GridTreeColumnMixin = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        /**
         * JS Path of the property in the item used as text content for the tree toggle.
         */
        path: {
          type: String,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['_onRendererOrBindingChanged(_renderer, _cells, _bodyContentHidden, _cells.*, path)'];
    }

    constructor() {
      super();

      this.__boundOnExpandedChanged = this.__onExpandedChanged.bind(this);
    }

    /**
     * Renders the grid tree toggle to the body cell
     *
     * @private
     */
    __defaultRenderer(root, _column, { item, expanded, level }) {
      let toggle = root.firstElementChild;
      if (!toggle) {
        toggle = document.createElement('vaadin-grid-tree-toggle');
        toggle.addEventListener('expanded-changed', this.__boundOnExpandedChanged);
        root.appendChild(toggle);
      }

      toggle.__item = item;
      toggle.__rendererExpanded = expanded;
      toggle.expanded = expanded;
      toggle.leaf = this.__isLeafItem(item, this._grid.itemHasChildrenPath);
      toggle.textContent = this.__getToggleContent(this.path, item);
      toggle.level = level;
    }

    /**
     * The tree column doesn't allow to use a custom renderer
     * to override the content of body cells.
     * It always renders the grid tree toggle to body cells.
     *
     * @override
     */
    _computeRenderer() {
      return this.__defaultRenderer;
    }

    /**
     * Expands or collapses the row once the tree toggle is switched.
     * The listener handles only user-fired events.
     *
     * @private
     */
    __onExpandedChanged(e) {
      // Skip if the state is changed by the renderer.
      if (e.detail.value === e.target.__rendererExpanded) {
        return;
      }

      if (e.detail.value) {
        this._grid.expandItem(e.target.__item);
      } else {
        this._grid.collapseItem(e.target.__item);
      }
    }

    /** @private */
    __isLeafItem(item, itemHasChildrenPath) {
      return !item || !item[itemHasChildrenPath];
    }

    /** @private */
    __getToggleContent(path, item) {
      return path && get(path, item);
    }
  };
