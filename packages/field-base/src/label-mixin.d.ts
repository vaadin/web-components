/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotMixin } from '@vaadin/component-base/src/slot-mixin.js';

/**
 * A mixin to provide label via corresponding property or named slot.
 */
declare function LabelMixin<T extends new (...args: any[]) => {}>(base: T): T & LabelMixinConstructor;

interface LabelMixinConstructor {
  new (...args: any[]): LabelMixin;
}

interface LabelMixin extends SlotMixin {
  /**
   * String used for a label element.
   */
  label: string | null | undefined;
}

export { LabelMixinConstructor, LabelMixin };
