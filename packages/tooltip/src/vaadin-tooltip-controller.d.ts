/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that manages the slotted tooltip element.
 */
export class HelperController extends SlotController {
  /**
   * String used for the helper text.
   */
  tooltipText: string | undefined;

  /**
   * Set tooltip text based on corresponding host property.
   */
  setTooltipText(helperText: string): void;

  /**
   * Set an HTML element to attach the tooltip to.
   */
  setTarget(target: HTMLElement): void;
}
