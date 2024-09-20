/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type {
  VirtualListDefaultItem,
  VirtualListItemModel,
  VirtualListMixinClass,
  VirtualListRenderer,
} from './vaadin-virtual-list-mixin.js';

export { VirtualListDefaultItem, VirtualListItemModel, VirtualListRenderer };

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
 */
declare class VirtualList<TItem = VirtualListDefaultItem> extends ThemableMixin(ElementMixin(HTMLElement)) {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface VirtualList<TItem = VirtualListDefaultItem> extends VirtualListMixinClass<TItem> {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-virtual-list': VirtualList;
  }
}

export { VirtualList };
