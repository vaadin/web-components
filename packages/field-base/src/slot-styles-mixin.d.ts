/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

/**
 * Mixin to insert styles into the outer scope to handle slotted components.
 * This is useful e.g. to hide native `<input type="number">` controls.
 */
export declare function SlotStylesMixin<T extends Constructor<HTMLElement>>(
  base: T
): T & Constructor<SlotStylesMixinClass>;

export declare class SlotStylesMixinClass {
  /**
   * List of styles to insert into root.
   */
  protected readonly slotStyles: string[];
}
