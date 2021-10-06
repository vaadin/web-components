/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridColumn } from './vaadin-grid-column.js';
import './vaadin-grid-sorter.js';

/**
 * `<vaadin-grid-sort-column>` is a helper element for the `<vaadin-grid>`
 * that provides default header renderer and functionality for sorting.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-sort-column path="name.first" direction="asc"></vaadin-grid-sort-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * @fires {CustomEvent} direction-changed - Fired when the `direction` property changes.
 */
class GridSortColumn extends GridColumn {
  static get is() {
    return 'vaadin-grid-sort-column';
  }

  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for sorting the data.
       */
      path: String,

      /**
       * How to sort the data.
       * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
       * descending direction, or `null` for not sorting the data.
       * @type {GridSorterDirection | undefined}
       */
      direction: {
        type: String,
        notify: true
      }
    };
  }

  static get observers() {
    return ['_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, direction)'];
  }

  constructor() {
    super();

    this.__boundOnDirectionChanged = this.__onDirectionChanged.bind(this);
  }

  /**
   * Renders the grid sorter to the header cell.
   *
   * @override
   */
  _defaultHeaderRenderer(root, _column) {
    let sorter = root.firstElementChild;
    if (!sorter) {
      sorter = document.createElement('vaadin-grid-sorter');
      sorter.addEventListener('direction-changed', this.__boundOnDirectionChanged);
      root.appendChild(sorter);
    }

    sorter.path = this.path;
    sorter.__rendererDirection = this.direction;
    sorter.direction = this.direction;
    sorter.textContent = this.__getHeader(this.header, this.path);
  }

  /**
   * The sort column doesn't allow to use a custom header renderer
   * to override the header cell content.
   * It always renders the grid sorter to the header cell.
   *
   * @override
   */
  _computeHeaderRenderer() {
    return this._defaultHeaderRenderer;
  }

  /**
   * Updates the sorting direction once the grid sorter's direction is changed.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onDirectionChanged(e) {
    // Skip if the direction is changed by the renderer.
    if (e.detail.value === e.target.__rendererDirection) {
      return;
    }

    this.direction = e.detail.value;
  }

  /** @private */
  __getHeader(header, path) {
    if (header) {
      return header;
    }

    if (path) {
      return this._generateHeader(path);
    }
  }
}

customElements.define(GridSortColumn.is, GridSortColumn);

export { GridSortColumn };
