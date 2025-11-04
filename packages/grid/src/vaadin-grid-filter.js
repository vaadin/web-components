/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/text-field/src/vaadin-text-field.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { gridFilterStyles } from './styles/vaadin-grid-filter-base-styles.js';
import { GridFilterElementMixin } from './vaadin-grid-filter-element-mixin.js';

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
 *
 * @customElement
 * @extends HTMLElement
 * @mixes GridFilterElementMixin
 */
class GridFilter extends GridFilterElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-grid-filter';
  }

  static get styles() {
    return gridFilterStyles;
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }
}

defineCustomElement(GridFilter);

export { GridFilter };
