import { GridColumnElement } from '@vaadin/vaadin-grid/src/vaadin-grid-column.js';

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
 */
declare class CrudEditColumnElement extends GridColumnElement {
  /**
   * The arial-label for the edit button
   */
  ariaLabel: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-crud-edit-column': CrudEditColumnElement;
  }
}

export { CrudEditColumnElement };
