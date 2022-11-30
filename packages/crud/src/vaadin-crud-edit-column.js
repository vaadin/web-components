/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import './vaadin-crud-edit.js';
import { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';

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
 * @extends GridColumn
 */
class CrudEditColumn extends GridColumn {
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
        value: '4em',
      },

      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       * @private
       */
      flexGrow: {
        type: Number,
        value: 0,
      },

      /** The arial-label for the edit button */
      ariaLabel: String,
    };
  }

  static get observers() {
    return ['_onRendererOrBindingChanged(_renderer, _cells, _cells.*, path, ariaLabel)'];
  }

  /**
   * Renders the crud edit element to the body cell.
   *
   * @override
   */
  _defaultRenderer(root, _column) {
    let edit = root.firstElementChild;
    if (!edit) {
      edit = document.createElement('vaadin-crud-edit');
      if (this.hasAttribute('theme')) {
        edit.setAttribute('theme', this.getAttribute('theme'));
      }
      root.appendChild(edit);
    }

    if (this.ariaLabel) {
      edit.setAttribute('aria-label', this.ariaLabel);
    } else {
      edit.removeAttribute('aria-label');
    }
  }
}

customElements.define(CrudEditColumn.is, CrudEditColumn);

export { CrudEditColumn };
