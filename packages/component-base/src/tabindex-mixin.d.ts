/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledMixinClass } from './disabled-mixin.js';

/**
 * A mixin to toggle the `tabindex` attribute.
 *
 * The attribute is set whenever the user activates the element by a pointer
 * or presses an activation key on the element from the keyboard.
 *
 * The attribute is removed as soon as the element is deactivated
 * by the pointer or by releasing the activation key.
 */
export declare const TabindexMixin: <T extends Constructor<HTMLElement>>(
  base: T
) => T & Constructor<TabindexMixinClass> & Constructor<DisabledMixinClass>;

export declare class TabindexMixinClass {
  /**
   * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
   */
  tabindex: number | undefined | null;

  /**
   * When the user has changed tabindex while the element is disabled,
   * the observer reverts tabindex to -1 and rather saves the new tabindex value to apply it later.
   * The new value will be applied as soon as the element becomes enabled.
   */
  protected _tabindexChanged(tabindex: number | undefined | null): void;
}
