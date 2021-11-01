/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare class SlotHost {
  /**
   * List of named slots to initialize.
   */
  protected readonly slots: Record<string, () => HTMLElement>;
}

/**
 * A mixin to provide content for named slots defined by component.
 */
export declare function SlotMixin<T extends Constructor<HTMLElement>>(
  superclass: T
): T & Constructor<SlotHost> & Pick<typeof SlotHost, keyof typeof SlotHost>;
