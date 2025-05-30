/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import './vaadin-crud-edit.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';
import { editColumnDefaultRenderer } from './vaadin-crud-helpers.js';

/**
 * `<vaadin-crud-edit-column>` is a helper element for the `<vaadin-grid>`
 * that provides a clickable and themable edit icon.
 *
 * Typical usage is in a custom `<vaadin-grid>` inside a `<vaadin-crud>`.
 *
 * #### Example:
 * ```html
 * <vaadin-grid>
 *  <vaadin-crud-edit-column></vaadin-crud-edit-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * @customElement
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
        value: '4rem',
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
    return ['_onRendererOrBindingChanged(_renderer, _cells, _bodyContentHidden, _cells.*, path, ariaLabel)'];
  }

  /**
   * Renders the crud edit element to the body cell.
   *
   * @override
   */
  _defaultRenderer(root, column) {
    editColumnDefaultRenderer(root, column);
  }
}

defineCustomElement(CrudEditColumn);

export { CrudEditColumn };
