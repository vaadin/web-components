/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { gridTreeToggleStyles } from './styles/vaadin-grid-tree-toggle-base-styles.js';
import { GridTreeToggleMixin } from './vaadin-grid-tree-toggle-mixin.js';

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
 * Attribute  | Description
 * -----------|-------------------------------------
 * `expanded` | When present, the toggle is expanded
 * `leaf`     | When present, the toggle is not expandable, i. e., the current item is a leaf
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property | Description | Default
 * ---|---|---
 * `--vaadin-grid-tree-toggle-level-offset` | Visual offset step for each tree sublevel | `1em`
 *
 * @fires {CustomEvent} expanded-changed - Fired when the `expanded` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DirMixin
 * @mixes GridTreeToggleMixin
 */
class GridTreeToggle extends GridTreeToggleMixin(
  ThemableMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-grid-tree-toggle';
  }

  static get styles() {
    return gridTreeToggleStyles;
  }

  /** @protected */
  render() {
    return html`
      <span id="level-spacer"></span>
      <span part="toggle"></span>
      <slot></slot>
    `;
  }
}

defineCustomElement(GridTreeToggle);

export { GridTreeToggle };
