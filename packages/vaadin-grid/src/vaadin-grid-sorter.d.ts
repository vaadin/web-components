import { GridSorterDirection } from './interfaces';

/**
 * Fired when the `direction` property changes.
 */
export type GridSorterDirectionChanged = CustomEvent<{ value: GridSorterDirection }>

export interface GridSorterElementEventMap {
  'sorter-changed': Event;

  'direction-changed': GridSorterDirectionChanged;
}

export interface GridSorterEventMap extends HTMLElementEventMap, GridSorterElementEventMap {}

/**
 * `<vaadin-grid-sorter>` is a helper element for the `<vaadin-grid>` that provides out-of-the-box UI controls,
 * visual feedback, and handlers for sorting the grid data.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column>
 *   <template class="header">
 *     <vaadin-grid-sorter path="name.first">First name</vaadin-grid-sorter>
 *   </template>
 *   <template>[[item.name.first]]</template>
 * </vaadin-grid-column>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `content` | The slotted content wrapper
 * `indicators` | The internal sorter indicators.
 * `order` | The internal sorter order
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `direction` | Sort direction of a sorter | :host
 *
 * @fires {CustomEvent} direction-changed - Fired when the `direction` property changes.
 * @fires {CustomEvent} sorter-changed - Fired when the `path` or `direction` property changes.
 */
declare class GridSorterElement extends HTMLElement {
  /**
   * JS Path of the property in the item used for sorting the data.
   */
  path: string | null | undefined;

  /**
   * How to sort the data.
   * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
   * descending direction, or `null` for not sorting the data.
   */
  direction: GridSorterDirection | null | undefined;

  _order: number | null;

  addEventListener<K extends keyof GridSorterEventMap>(
    type: K,
    listener: (this: GridSorterElement, ev: GridSorterEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof GridSorterEventMap>(
    type: K,
    listener: (this: GridSorterElement, ev: GridSorterEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-sorter': GridSorterElement;
  }
}

export { GridSorterElement };
