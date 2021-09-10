/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DelegateFocusMixin } from './delegate-focus-mixin.js';
import { SlotMixin } from './slot-mixin.js';
import { InputMixin } from './input-mixin.js';

/**
 * A mixin to add `<textarea>` element to the corresponding named slot.
 */
declare function TextAreaSlotMixin<T extends new (...args: any[]) => {}>(base: T): T & TextAreaSlotMixinConstructor;

interface TextAreaSlotMixinConstructor {
  new (...args: any[]): TextAreaSlotMixin;
}

interface TextAreaSlotMixin extends DelegateFocusMixin, InputMixin, SlotMixin {}

export { TextAreaSlotMixinConstructor, TextAreaSlotMixin };
