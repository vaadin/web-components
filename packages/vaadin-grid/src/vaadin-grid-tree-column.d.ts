import { GridColumnElement } from './vaadin-grid-column.js';

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
declare class GridTreeColumnElement extends GridColumnElement {
  /**
   * JS Path of the property in the item used as text content for the tree toggle.
   */
  path: string | null | undefined;

  /**
   * JS Path of the property in the item that indicates whether the item has child items.
   * @attr {string} item-has-children-path
   */
  itemHasChildrenPath: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-tree-column': GridTreeColumnElement;
  }
}

export { GridTreeColumnElement };
