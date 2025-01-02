/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export type ComboBoxDefaultItem = any;

export interface ComboBoxItemModel<TItem> {
  index: number;
  item: TItem;
  selected: boolean;
  focused: boolean;
}

export type ComboBoxItemRenderer<TItem, TOwner> = (
  root: HTMLElement,
  owner: TOwner,
  model: ComboBoxItemModel<TItem>,
) => void;

export declare function ComboBoxItemMixin<TItem, TOwner, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxItemMixinClass<TItem, TOwner>> & T;

export declare class ComboBoxItemMixinClass<TItem, TOwner> {
  /**
   * The item to render.
   */
  index: number;

  /**
   * The item to render.
   */
  item: TItem;

  /**
   * The text to render in the item.
   */
  label: string;

  /**
   * True when item is selected.
   */
  selected: boolean;

  /**
   * True when item is focused.
   */
  focused: boolean;

  /**
   * Custom function for rendering the item content.
   */
  renderer: ComboBoxItemRenderer<TItem, TOwner>;

  /**
   * Requests an update for the content of the item.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;
}
