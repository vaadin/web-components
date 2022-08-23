/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that manages the slotted tooltip element.
 */
export class TooltipController extends SlotController {
  /**
   * An HTML element to attach the tooltip to.
   */
  target: HTMLElement;

  /**
   * Set an HTML element to attach the tooltip to.
   */
  setTarget(target: HTMLElement): void;
}
