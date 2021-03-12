/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { GridColumnElement } from './vaadin-grid-column.js';
import './vaadin-grid-tree-toggle.js';

/**
 * `<vaadin-grid-tree-column>` is a helper element for the `<vaadin-grid>`
 * that provides default template and functionality for toggling tree/hierarchical items.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-tree-column path="name.first"></vaadin-grid-tree-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 */
class GridTreeColumnElement extends GridColumnElement {
  static get template() {
    return html`
      <template id="template">
        <vaadin-grid-tree-toggle
          leaf="[[__isLeafItem(item, itemHasChildrenPath)]]"
          expanded="{{expanded}}"
          level="[[level]]"
        >
          [[__getToggleContent(path, item)]]
        </vaadin-grid-tree-toggle>
      </template>
    `;
  }

  static get is() {
    return 'vaadin-grid-tree-column';
  }

  static get properties() {
    return {
      /**
       * JS Path of the property in the item used as text content for the tree toggle.
       */
      path: String,

      /**
       * JS Path of the property in the item that indicates whether the item has child items.
       * @attr {string} item-has-children-path
       */
      itemHasChildrenPath: {
        type: String,
        value: 'children'
      }
    };
  }

  /** @private */
  _prepareBodyTemplate() {
    const template = this._prepareTemplatizer(this.$.template);
    // needed to override the dataHost correctly in case internal template is used.
    template.templatizer.dataHost = this;
    return template;
  }

  __isLeafItem(item, itemHasChildrenPath) {
    return !(item && item[itemHasChildrenPath]);
  }

  __getToggleContent(path, item) {
    return path && this.get(path, item);
  }
}

customElements.define(GridTreeColumnElement.is, GridTreeColumnElement);

export { GridTreeColumnElement };
