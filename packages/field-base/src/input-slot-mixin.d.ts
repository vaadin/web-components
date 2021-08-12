/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotMixin } from './slot-mixin.js';

/**
 * A mixin to add `<input>` element to the corresponding named slot.
 */
declare function InputSlotMixin<T extends new (...args: any[]) => {}>(base: T): T & InputSlotMixinConstructor;

interface InputSlotMixinConstructor {
  new (...args: any[]): InputSlotMixin;
}

interface InputSlotMixin extends SlotMixin {
  /**
   * String used to define input type.
   */
  readonly type: string;
}

export { InputSlotMixinConstructor, InputSlotMixin };
