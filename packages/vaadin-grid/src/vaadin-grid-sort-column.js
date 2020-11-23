/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridColumnElement } from './vaadin-grid-column.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
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
 */
class GridSortColumnElement extends GridColumnElement {
  static get template() {
    return html`
      <template class="header" id="headerTemplate">
        <vaadin-grid-sorter path="[[path]]" direction="{{direction}}">[[_getHeader(header, path)]]</vaadin-grid-sorter>
      </template>
    `;
  }

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

  /** @private */
  _prepareHeaderTemplate() {
    const headerTemplate = this._prepareTemplatizer(this.$.headerTemplate);
    // needed to override the dataHost correctly in case internal template is used.
    headerTemplate.templatizer.dataHost = this;
    return headerTemplate;
  }

  /** @private */
  _getHeader(header, path) {
    return header || this._generateHeader(path);
  }
}

customElements.define(GridSortColumnElement.is, GridSortColumnElement);

export { GridSortColumnElement };
