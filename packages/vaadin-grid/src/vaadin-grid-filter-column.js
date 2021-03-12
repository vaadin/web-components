/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
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
  static get template() {
    return html`
      <template class="header" id="headerTemplate">
        <vaadin-grid-filter path="[[path]]" value="[[_filterValue]]">
          <vaadin-text-field
            theme="small"
            focus-target=""
            style="max-width: 100%;"
            slot="filter"
            value="{{_filterValue}}"
            label="[[_getHeader(header, path)]]"
          ></vaadin-text-field>
        </vaadin-grid-filter>
      </template>
    `;
  }

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

customElements.define(GridFilterColumnElement.is, GridFilterColumnElement);

export { GridFilterColumnElement };
