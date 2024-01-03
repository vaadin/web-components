/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { VirtualListMixin } from './vaadin-virtual-list-mixin.js';
import { virtualListStyles } from './vaadin-virtual-list-styles.js';

registerStyles('vaadin-virtual-list', virtualListStyles, { moduleId: 'vaadin-virtual-list-styles' });

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
class VirtualList extends ElementMixin(ThemableMixin(VirtualListMixin(PolymerElement))) {
  static get template() {
    return html`
      <div id="items">
        <slot></slot>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-virtual-list';
  }
}

defineCustomElement(VirtualList);

export { VirtualList };
