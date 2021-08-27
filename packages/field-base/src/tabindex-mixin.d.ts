/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from './disabled-mixin.js';

/**
 * A mixin to provide the `tabindex` attribute.
 *
 * By default, the attribute is set to 0 that makes the element focusable.
 *
 * The attribute is set to -1 whenever the user disables the element
 * and restored with the last known value once the element is enabled.
 */
declare function TabindexMixin<T extends new (...args: any[]) => {}>(base: T): T & TabindexMixinConstructor;

interface TabindexMixinConstructor {
  new (...args: any[]): TabindexMixin;
}

interface TabindexMixin extends DisabledMixin {
  /**
   * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
   */
  tabindex: number | undefined | null;
}

export { TabindexMixinConstructor, TabindexMixin };
