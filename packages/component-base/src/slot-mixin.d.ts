/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin to provide content for named slots defined by component.
 */
export declare function SlotMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<SlotMixinClass> & T;

export declare class SlotMixinClass {
  /**
   * List of named slots to initialize.
   */
  protected readonly slots: Record<string, () => HTMLElement>;
}
