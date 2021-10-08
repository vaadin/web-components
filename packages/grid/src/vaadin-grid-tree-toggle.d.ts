/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Fired when the `expanded` property changes.
 */
export type GridTreeToggleExpandedChangedEvent = CustomEvent<{ value: boolean }>;

export interface GridTreeToggleCustomEventMap {
  'expanded-changed': GridTreeToggleExpandedChangedEvent;
}

export interface GridTreeToggleEventMap extends HTMLElementEventMap, GridTreeToggleCustomEventMap {}

/**
 * `<vaadin-grid-tree-toggle>` is a helper element for the `<vaadin-grid>`
 * that provides toggle and level display functionality for the item tree.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column id="column"></vaadin-grid-column>
 * ```
 * ```js
 * const column = document.querySelector('#column');
 * column.renderer = (root, column, model) => {
 *   let treeToggle = root.firstElementChild;
 *   if (!treeToggle) {
 *     treeToggle = document.createElement('vaadin-grid-tree-toggle');
 *     treeToggle.addEventListener('expanded-changed', () => { ... });
 *     root.appendChild(treeToggle);
 *   }
 *   treeToggle.leaf = !model.item.hasChildren;
 *   treeToggle.level = level;
 *   treeToggle.expanded = expanded;
 *   treeToggle.textContent = model.item.name;
 * };
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
 *
 * @fires {CustomEvent} expanded-changed - Fired when the `expanded` property changes.
 */
declare class GridTreeToggle extends ThemableMixin(DirMixin(HTMLElement)) {
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
    listener: (this: GridTreeToggle, ev: GridTreeToggleEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof GridTreeToggleEventMap>(
    type: K,
    listener: (this: GridTreeToggle, ev: GridTreeToggleEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-tree-toggle': GridTreeToggle;
  }
}

export { GridTreeToggle };
