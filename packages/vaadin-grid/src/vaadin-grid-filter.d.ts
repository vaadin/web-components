/**
 * Fired when the `value` property changes.
 */
export type GridFilterValueChanged = CustomEvent<{ value: string }>

export interface GridFilterElementEventMap {
  'value-changed': GridFilterValueChanged;
}

export interface GridFilterEventMap extends HTMLElementEventMap, GridFilterElementEventMap {}

/**
 * `<vaadin-grid-filter>` is a helper element for the `<vaadin-grid>` that provides out-of-the-box UI controls,
 * and handlers for filtering the grid data.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column>
 *   <template class="header">
 *     <vaadin-grid-filter path="name.first"></vaadin-grid-filter>
 *   </template>
 *   <template>[[item.name.first]]</template>
 * </vaadin-grid-column>
 * ```
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
