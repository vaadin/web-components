/**
 * Fired when the `value` property changes.
 */
export type GridFilterValueChangedEvent = CustomEvent<{ value: string }>;

export interface GridFilterElementEventMap {
  'value-changed': GridFilterValueChangedEvent;
}

export interface GridFilterEventMap extends HTMLElementEventMap, GridFilterElementEventMap {}

/**
 * `<vaadin-grid-filter>` is a helper element for the `<vaadin-grid>` that provides out-of-the-box UI controls,
 * and handlers for filtering the grid data.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column id="column"></vaadin-grid-column>
 * ```
 * ```js
 * const column = document.querySelector('#column');
 * column.headerRenderer = (root, column) => {
 *   let filter = root.firstElementChild;
 *   if (!filter) {
 *     filter = document.createElement('vaadin-grid-filter');
 *     root.appendChild(filter);
 *   }
 *   filter.path = 'name.first';
 * };
 * column.renderer = (root, column, model) => {
 *   root.textContent = model.item.name.first;
 * };
 * ```
 *
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class GridFilterElement extends HTMLElement {
  /**
   * JS Path of the property in the item used for filtering the data.
   */
  path: string | null | undefined;

  /**
   * Current filter value.
   */
  value: string | null | undefined;

  addEventListener<K extends keyof GridFilterEventMap>(
    type: K,
    listener: (this: GridFilterElement, ev: GridFilterEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof GridFilterEventMap>(
    type: K,
    listener: (this: GridFilterElement, ev: GridFilterEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-filter': GridFilterElement;
  }
}

export { GridFilterElement };
