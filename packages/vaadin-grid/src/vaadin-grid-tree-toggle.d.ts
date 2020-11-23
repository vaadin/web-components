import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Fired when the `expanded` property changes.
 */
export type GridTreeToggleExpandedChanged = CustomEvent<{ value: boolean }>;

export interface GridTreeToggleElementEventMap {
  'expanded-changed': GridTreeToggleExpandedChanged;
}

export interface GridTreeToggleEventMap extends HTMLElementEventMap, GridTreeToggleElementEventMap {}

/**
 * `<vaadin-grid-tree-toggle>` is a helper element for the `<vaadin-grid>`
 * that provides toggle and level display functionality for the item tree.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column>
 *   <template class="header">Package name</template>
 *   <template>
 *     <vaadin-grid-tree-toggle
 *         leaf="[[!item.hasChildren]]"
 *         expanded="{{expanded}}"
 *         level="[[level]]">
 *       [[item.name]]
 *     </vaadin-grid-tree-toggle>
 *   </template>
 * </vaadin-grid-column>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ---|---
 * `toggle` | The tree toggle icon
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * ---|---|---
 * `expanded` | When present, the toggle is expanded | :host
 * `leaf` | When present, the toggle is not expandable, i. e., the current item is a leaf | :host
 *
 * The following custom CSS properties are available on
 * the `<vaadin-grid-tree-toggle>` element:
 *
 * Custom CSS property | Description | Default
 * ---|---|---
 * `--vaadin-grid-tree-toggle-level-offset` | Visual offset step for each tree sublevel | `1em`
 */
declare class GridTreeToggleElement extends ThemableMixin(HTMLElement) {
  /**
   * Current level of the tree represented with a horizontal offset
   * of the toggle button.
   */
  level: number;

  /**
   * Hides the toggle icon and disables toggling a tree sublevel.
   */
  leaf: boolean;

  /**
   * Sublevel toggle state.
   */
  expanded: boolean;

  addEventListener<K extends keyof GridTreeToggleEventMap>(
    type: K,
    listener: (this: GridTreeToggleElement, ev: GridTreeToggleEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof GridTreeToggleEventMap>(
    type: K,
    listener: (this: GridTreeToggleElement, ev: GridTreeToggleEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-tree-toggle': GridTreeToggleElement;
  }
}

export { GridTreeToggleElement };
