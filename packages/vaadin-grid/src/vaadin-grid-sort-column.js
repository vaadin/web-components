/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridColumnElement } from './vaadin-grid-column.js';
import './vaadin-grid-sorter.js';

/**
 * `<vaadin-grid-sort-column>` is a helper element for the `<vaadin-grid>`
 * that provides default header template and functionality for sorting.
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
class GridSortColumnElement extends GridColumnElement {
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
    return ['__onDefaultHeaderRendererBindingChanged(direction, path, header)'];
  }

  constructor() {
    super();

    this.__boundOnDirectionChanged = this.__onDirectionChanged.bind(this);
  }

  /**
   * Renders `vaadin-grid-sorter` to the header cell
   *
   * @private
   */
  __defaultHeaderRenderer(root, _column) {
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
   * Re-runs the header default renderer once a column instance property
   * used in the renderer is changed.
   *
   * @private
   */
  __onDefaultHeaderRendererBindingChanged() {
    if (this.__headerRenderer !== this.__defaultHeaderRenderer) {
      return;
    }

    if (!this._headerCell) {
      return;
    }

    this.__runRenderer(this.__headerRenderer, this._headerCell);
  }

  /**
   * The sort column is not supposed to be used with other renderers
   * except the default header renderer.
   *
   * @private
   */
  __computeHeaderRenderer() {
    return this.__defaultHeaderRenderer;
  }

  /**
   * Updates the `direction` property once the direction of `vaadin-grid-sorter` is changed.
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
  __getHeader() {
    if (this.header) {
      return this.header;
    }

    if (this.path) {
      return this._generateHeader(this.path);
    }
  }
}

customElements.define(GridSortColumnElement.is, GridSortColumnElement);

export { GridSortColumnElement };
