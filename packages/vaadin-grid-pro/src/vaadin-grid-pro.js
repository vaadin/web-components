/**
 * @license
 * Copyright (c) 2019 - 2020 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0 (CVDLv4).
 * See <a href="https://vaadin.com/license/cvdl-4.0">the website</a> for the complete license.
 */
import { GridElement } from '@vaadin/vaadin-grid/src/vaadin-grid.js';
import { InlineEditingMixin } from './vaadin-grid-pro-inline-editing-mixin.js';
import '@vaadin/vaadin-license-checker/vaadin-license-checker.js';

/**
 *
 * `<vaadin-grid-pro>` is a high quality data grid / data table Web Component with extended functionality.
 * It extends `<vaadin-grid>` and adds extra features on top of the basic ones.
 *
 * See [`<vaadin-grid>` documentation](https://github.com/vaadin/vaadin-grid/blob/master/src/vaadin-grid.html)
 * for details.
 *
 * ```
 * <vaadin-grid-pro></vaadin-grid-pro>
 * ```
 *
 * @fires {CustomEvent} active-item-changed - Fired when the `activeItem` property changes.
 * @fires {CustomEvent} cell-activate - Fired when the cell is activated with click or keyboard.
 * @fires {CustomEvent} cell-edit-started - Fired when the user starts editing a grid cell.
 * @fires {CustomEvent} column-reorder - Fired when the columns in the grid are reordered.
 * @fires {CustomEvent} column-resize - Fired when the grid column resize is finished.
 * @fires {CustomEvent} expanded-items-changed - Fired when the `expandedItems` property changes.
 * @fires {CustomEvent} grid-dragstart - Fired when starting to drag grid rows.
 * @fires {CustomEvent} grid-dragend - Fired when the dragging of the rows ends.
 * @fires {CustomEvent} grid-drop - Fired when a drop occurs on top of the grid.
 * @fires {CustomEvent} item-property-changed - Fired before exiting the cell edit mode, if the value has been changed.
 * @fires {CustomEvent} loading-changed - Fired when the `loading` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 *
 * @extends GridElement
 * @mixes InlineEditingMixin
 */
class GridProElement extends InlineEditingMixin(GridElement) {
  static get is() {
    return 'vaadin-grid-pro';
  }

  static get version() {
    return '3.0.0-alpha1';
  }

  /**
   * @protected
   */
  static _finalizeClass() {
    super._finalizeClass();

    const devModeCallback = window.Vaadin.developmentModeCallback;
    const licenseChecker = devModeCallback && devModeCallback['vaadin-license-checker'];
    if (typeof licenseChecker === 'function') {
      licenseChecker(GridProElement);
    }
  }
}

customElements.define(GridProElement.is, GridProElement);

export { GridProElement };
