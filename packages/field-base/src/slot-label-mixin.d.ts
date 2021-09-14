/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LabelMixin } from './label-mixin.js';
import { SlotTargetMixin } from './slot-target-mixin.js';

/**
 * A mixin to forward any content from the default slot to the label node.
 */
declare function SlotLabelMixin<T extends new (...args: any[]) => {}>(base: T): T & SlotLabelMixinConstructor;

interface SlotLabelMixinConstructor {
  new (...args: any[]): SlotLabelMixin;
}

interface SlotLabelMixin extends SlotTargetMixin, LabelMixin {}

export { SlotLabelMixinConstructor, SlotLabelMixin };
