import { GridColumnElement } from './vaadin-grid-column.js';

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
declare class GridFilterColumnElement extends GridColumnElement {
  /**
   * Text to display as the label of the column filter text-field.
   */
  header: string | null | undefined;

  /**
   * JS Path of the property in the item used for filtering the data.
   */
  path: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-filter-column': GridFilterColumnElement;
  }
}

export { GridFilterColumnElement };
