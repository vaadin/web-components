/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridColumnElement } from './vaadin-grid-column.js';
import './vaadin-grid-filter.js';

/**
 * `<vaadin-grid-filter-column>` is a helper element for the `<vaadin-grid>`
 * that provides default header template and functionality for filtering.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-filter-column path="name.first"></vaadin-grid-filter-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 */
class GridFilterColumnElement extends GridColumnElement {
  static get is() {
    return 'vaadin-grid-filter-column';
  }

  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for filtering the data.
       */
      path: String,

      /**
       * Text to display as the label of the column filter text-field.
       */
      header: String
    };
  }

  static get observers() {
    return ['__onDefaultHeaderRendererBindingChanged(_filterValue, path, header)'];
  }

  constructor() {
    super();

    this.__boundOnFilterValueChanged = this.__onFilterValueChanged.bind(this);
  }

  /**
   * Renders `vaadin-grid-filter` with the custom text field to the header cell
   *
   * @private
   */
  __defaultHeaderRenderer(root, _column) {
    let filter = root.firstElementChild;
    let textField = filter?.firstElementChild;

    if (!filter) {
      filter = document.createElement('vaadin-grid-filter');
      textField = document.createElement('vaadin-text-field');
      textField.setAttribute('slot', 'filter');
      textField.setAttribute('theme', 'small');
      textField.setAttribute('style', 'max-width: 100%;');
      textField.setAttribute('focus-target', '');
      textField.addEventListener('value-changed', this.__boundOnFilterValueChanged);
      filter.appendChild(textField);
      root.appendChild(filter);
    }

    filter.path = this.path;
    filter.value = this._filterValue;

    textField.__rendererValue = this._filterValue;
    textField.value = this._filterValue;
    textField.label = this.__getHeader();
  }

  /**
   * Re-runs the header renderer when a column instance property used in the renderer is changed
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
   * The filter column is supposed to use with no other renderers
   * except the default header renderer
   *
   * @private
   */
  __computeHeaderRenderer() {
    return this.__defaultHeaderRenderer;
  }

  /**
   * Updates the `_filterValue` property after the value of the filter text field is changed.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onFilterValueChanged(e) {
    if (e.detail.value === e.target.__rendererValue) {
      return;
    }

    this._filterValue = e.detail.value;
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

customElements.define(GridFilterColumnElement.is, GridFilterColumnElement);

export { GridFilterColumnElement };
