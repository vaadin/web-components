/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { VirtualList } from './vaadin-virtual-list.js';

export type VirtualListDefaultItem = any;

export interface VirtualListItemModel<TItem> {
  index: number;
  item: TItem;
}

export type VirtualListRenderer<TItem> = (
  root: HTMLElement,
  virtualList: VirtualList<TItem>,
  model: VirtualListItemModel<TItem>,
) => void;

export declare function VirtualListMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> & Constructor<VirtualListMixinClass<TItem>> & T;

export declare class VirtualListMixinClass<TItem = VirtualListDefaultItem> {
  /**
   * Gets the index of the first visible item in the viewport.
   */
  readonly firstVisibleIndex: number;

  /**
   * Gets the index of the last visible item in the viewport.
   */
  readonly lastVisibleIndex: number;

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
  items: TItem[] | undefined;

  /**
   * A function that generates accessible names for virtual list items.
   * The function gets the item as an argument and the
   * return value should be a string representing that item. The
   * result gets applied to the corresponding virtual list child element
   * as an `aria-label` attribute.
   */
  itemAccessibleNameGenerator?: (item: TItem) => string;

  /**
   * Scroll to a specific index in the virtual list.
   */
  scrollToIndex(index: number): void;

  /**
   * Requests an update for the content of the rows.
   * While performing the update, it invokes the renderer passed in the `renderer` property for each visible row.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;
}
