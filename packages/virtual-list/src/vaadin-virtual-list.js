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
import { virtualListStyles } from './styles/vaadin-virtual-list-core-styles.js';
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
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|--------------------------------------------
 * `overflow`       | Set to `top`, `bottom`, both, or none.
 *
 * See [Virtual List](https://vaadin.com/docs/latest/components/virtual-list) documentation.
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
