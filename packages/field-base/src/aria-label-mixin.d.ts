/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LabelMixin } from './label-mixin.js';
import { InputSlotMixin } from './input-slot-mixin.js';

/**
 * A mixin to link slotted `<input>` and `<label>` elements.
 */
declare function AriaLabelMixin<T extends new (...args: any[]) => {}>(base: T): T & AriaLabelMixinConstructor;

interface AriaLabelMixinConstructor {
  new (...args: any[]): AriaLabelMixin;
}

interface AriaLabelMixin extends InputSlotMixin, LabelMixin {}

export { AriaLabelMixin, AriaLabelMixinConstructor };
