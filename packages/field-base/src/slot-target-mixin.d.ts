/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to forward the content from a source slot to a target element.
 */
declare function SlotTargetMixinMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & SlotTargetMixinMixinConstructor;

interface SlotTargetMixinMixinConstructor {
  new (...args: any[]): SlotTargetMixinMixin;
}

interface SlotTargetMixinMixin {
  /**
   * A reference to the source slot from which the content is forwarded to the target element.
   *
   * @protected
   */
  _sourceSlot: HTMLSlotElement;

  /**
   * A reference to the target element to which the content is forwarded from the source slot.
   *
   * @protected
   */
  _slotTarget: HTMLElement;
}

export { SlotTargetMixinMixinConstructor, SlotTargetMixinMixin };
