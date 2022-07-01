/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ActiveMixinClass } from '@vaadin/component-base/src/active-mixin.js';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';

/**
 * A mixin providing `focused`, `focus-ring`, `active`, `disabled` and `selected`.
 *
 * `focused`, `active` and `focus-ring` are set as only as attributes.
 */
export declare function ItemMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ActiveMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<ItemMixinClass> &
  T;

export declare class ItemMixinClass {
  value: string;

  /**
   * If true, the item is in selected state.
   */
  selected: boolean;

  /**
   * Used for mixin detection because `instanceof` does not work with mixins.
   * e.g. in VaadinListMixin it filters items by using the
   * `element._hasVaadinItemMixin` condition.
   */
  protected _hasVaadinItemMixin: boolean;
}
