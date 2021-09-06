/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Mixin to insert styles into the outer scope to handle slotted components.
 * This is useful e.g. to hide native `<input type="number">` controls.
 */
declare function SlotStylesMixin<T extends new (...args: any[]) => {}>(base: T): T & SlotStylesMixinConstructor;

interface SlotStylesMixinConstructor {
  new (...args: any[]): SlotStylesMixin;
}

interface SlotStylesMixin {
  /**
   * List of styles to insert into root.
   */
  readonly slotStyles: string[];
}

export { SlotStylesMixinConstructor, SlotStylesMixin };
