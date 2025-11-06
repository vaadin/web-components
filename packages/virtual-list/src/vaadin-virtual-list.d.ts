/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
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
