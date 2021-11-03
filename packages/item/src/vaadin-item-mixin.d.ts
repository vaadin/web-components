/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing `focused`, `focus-ring`, `active`, `disabled` and `selected`.
 *
 * `focused`, `active` and `focus-ring` are set as only as attributes.
 */
export declare function ItemMixin<T extends Constructor<HTMLElement>>(base: T): T & Constructor<ItemMixinClass>;

export declare class ItemMixinClass {
  value: string;

  /**
   * Used for mixin detection because `instanceof` does not work with mixins.
   * e.g. in VaadinListMixin it filters items by using the
   * `element._hasVaadinItemMixin` condition.
   */
  protected _hasVaadinItemMixin: boolean;

  /**
   * If true, the user cannot interact with this element.
   */
  disabled: boolean;

  /**
   * If true, the item is in selected state.
   */
  selected: boolean;

  protected _setFocused(focused: boolean): void;

  protected _setActive(active: boolean): void;

  protected _onKeydown(event: KeyboardEvent): void;

  protected _onKeyup(event: KeyboardEvent): void;
}
