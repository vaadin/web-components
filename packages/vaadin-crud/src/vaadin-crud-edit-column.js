/**
 * @license
 * Copyright (c) 2017 - 2020 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { GridColumnElement } from '@vaadin/vaadin-grid/src/vaadin-grid-column.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import './vaadin-crud-edit.js';

/**
 * `<vaadin-crud-edit-column>` is a helper element for the `<vaadin-grid>`
 * that provides a clickable and themable edit icon.
 *
 * Typical usage is in a custom `<vaadin-grid>` inside a `<vaadin-crud>`.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-crud-edit-column></vaadin-crud-edit-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * @extends GridColumnElement
 */
class CrudEditColumnElement extends GridColumnElement {
  static get template() {
    return html`
      <template class="header" id="defaultHeaderTemplate" aria-label="Edit"> </template>
      <template id="defaultBodyTemplate">
        <div id="edit">Edit</div>
      </template>
    `;
  }

  static get is() {
    return 'vaadin-crud-edit-column';
  }

  static get properties() {
    return {
      /**
       * Width of the cells for this column.
       * @private
       */
      width: {
        type: String,
        value: '4em'
      },

      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       * @private
       */
      flexGrow: {
        type: Number,
        value: 0
      },

      /** The arial-label for the edit button */
      ariaLabel: String
    };
  }

  /** @private */
  ready() {
    super.ready();
    this.renderer = (root) => {
      if (!root.firstElementChild) {
        const elm = document.createElement('vaadin-crud-edit');
        this.hasAttribute('theme') && elm.setAttribute('theme', this.getAttribute('theme'));
        this.editLabel && elm.setAttribute('aria-label', this.ariaLabel);
        root.appendChild(elm);
      }
    };
  }
}

customElements.define(CrudEditColumnElement.is, CrudEditColumnElement);

export { CrudEditColumnElement };
