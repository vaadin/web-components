/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin providing `focused`, `focus-ring`, `active`, `disabled` and `selected`.
 *
 * `focused`, `active` and `focus-ring` are set as only as attributes.
 */
declare function ItemMixin<T extends new (...args: any[]) => {}>(base: T): T & ItemMixinConstructor;

interface ItemMixinConstructor {
  new (...args: any[]): ItemMixin;
}

interface ItemMixin {
  value: string;

  /**
   * If true, the user cannot interact with this element.
   */
  disabled: boolean;

  /**
   * If true, the item is in selected state.
   */
  selected: boolean;
}

export { ItemMixin, ItemMixinConstructor };
