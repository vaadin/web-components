import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

export type VirtualListDefaultItem = any;

export interface VirtualListItemModel<TItem> {
  index: number;
  item: TItem;
}

export type VirtualListRenderer<TItem> = (
  root: HTMLElement,
  virtualList: VirtualListElement<TItem>,
  model: VirtualListItemModel<TItem>
) => void;

/**
 * `<vaadin-virtual-list>` is a Web Component for displaying a virtual/infinite list or items.
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
 * See [Virtual List](https://vaadin.com/docs/latest/ds/components/virtual-list) documentation.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
declare class VirtualListElement<TItem = VirtualListDefaultItem> extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * Custom function for rendering the content of every item.
   * Receives three arguments:
   *
   * - `root` The render target element representing one item at a time.
   * - `virtualList` The reference to the `<vaadin-virtual-list>` element.
   * - `model` The object with the properties related with the rendered
   *   item, contains:
   *   - `model.index` The index of the rendered item.
   *   - `model.item` The item.
   */
  renderer: VirtualListRenderer<TItem> | undefined;

  /**
   * An array containing items determining how many instances to render.
   */
  items: Array<TItem> | undefined;

  /**
   * Scroll to a specific index in the virtual list.
   */
  scrollToIndex(index: number): void;

  /**
   * Gets the index of the first visible item in the viewport.
   */
  readonly firstVisibleIndex: number;

  /**
   * Gets the index of the last visible item in the viewport.
   */
  readonly lastVisibleIndex: number;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-virtual-list': VirtualListElement;
  }
}

export { VirtualListElement };
