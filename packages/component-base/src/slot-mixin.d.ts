/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
