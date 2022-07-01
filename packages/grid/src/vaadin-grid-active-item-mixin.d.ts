/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function ActiveItemMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ActiveItemMixinClass<TItem>> & T;

export declare class ActiveItemMixinClass<TItem> {
  /**
   * The item user has last interacted with. Turns to `null` after user deactivates
   * the item by re-interacting with the currently active item.
   */
  activeItem: TItem | null;
}

export declare function isFocusable(target: Element): boolean;
