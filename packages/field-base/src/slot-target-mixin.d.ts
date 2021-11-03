/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin to copy the content from a source slot to a target element.
 */
export declare function SlotTargetMixin<T extends Constructor<HTMLElement>>(
  base: T
): T & Constructor<SlotTargetMixinClass>;

export declare class SlotTargetMixinClass {
  /**
   * A reference to the source slot from which the content is copied to the target element.
   */
  protected readonly _sourceSlot: HTMLSlotElement;

  /**
   * A reference to the target element to which the content is copied from the source slot.
   */
  protected readonly _slotTarget: HTMLElement;
}
