/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { virtualListStyles } from './styles/vaadin-virtual-list-base-styles.js';
import { VirtualListMixin } from './vaadin-virtual-list-mixin.js';

/**
 * `<vaadin-virtual-list>` is a Web Component for displaying a virtual/infinite list of items.
 *
 * ```html
 * <vaadin-virtual-list></vaadin-virtual-list>
 * ```
 *
 * ```js
 * const list = document.querySelector('vaadin-virtual-list');
 * list.items = items; // An array of data items
 * list.renderer = (root, list, {item, index}) => {
 *   root.textContent = `#${index}: ${item.name}`
 * }
 * ```
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|--------------------------------------------
 * `overflow`       | Set to `top`, `bottom`, both, or none.
 *
 * ### Built-in Theme Variants
 *
 * `<vaadin-virtual-list>` supports the following theme variants:
 *
 * Theme variant                            | Description
 * -----------------------------------------|---------------
 * `theme="overflow-indicators"`            | Shows visual indicators at the top and bottom when the content is scrolled
 * `theme="overflow-indicator-top"`         | Shows the visual indicator at the top when the content is scrolled
 * `theme="overflow-indicator-top-bottom"`  | Shows the visual indicator at the bottom when the content is scrolled
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                    | Description
 * ---------------------------------------|-------------
 * `--vaadin-virtual-list-padding-block`  | The CSS padding applied to top and bottom edges
 * `--vaadin-virtual-list-padding-inline` | The CSS padding applied to left and right edges
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes VirtualListMixin
 */
class VirtualList extends VirtualListMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-virtual-list';
  }

  static get styles() {
    return virtualListStyles;
  }

  /** @protected */
  render() {
    return html`
      <div id="items">
        <slot></slot>
      </div>
    `;
  }
}

defineCustomElement(VirtualList);

export { VirtualList };
