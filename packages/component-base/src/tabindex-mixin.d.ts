/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledMixinClass } from './disabled-mixin.js';

/**
 * A mixin to toggle the `tabindex` attribute.
 *
 * The attribute is set to -1 whenever the user disables the element
 * and restored with the last known value once the element is enabled.
 */
export declare function TabindexMixin<T extends Constructor<HTMLElement>>(
  base: T
): T & Constructor<DisabledMixinClass> & Constructor<TabindexMixinClass>;

export declare class TabindexMixinClass {
  /**
   * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
   */
  tabindex: number | undefined | null;

  /**
   * Stores the last known tabindex since the element has been disabled.
   */
  protected _lastTabIndex: number | undefined | null;

  /**
   * When the user has changed tabindex while the element is disabled,
   * the observer reverts tabindex to -1 and rather saves the new tabindex value to apply it later.
   * The new value will be applied as soon as the element becomes enabled.
   */
  protected _tabindexChanged(tabindex: number | undefined | null): void;
}
