/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function ActiveItemMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): T & Constructor<ActiveItemMixinClass<TItem>>;

export declare class ActiveItemMixinClass<TItem> {
  /**
   * The item user has last interacted with. Turns to `null` after user deactivates
   * the item by re-interacting with the currently active item.
   */
  activeItem: TItem | null;
}

export declare function isFocusable(target: Element): boolean;
