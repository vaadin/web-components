/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller to manage the label element.
 */
export class LabelController extends SlotController {
  /**
   * String used for the label.
   */
  label: string | null | undefined;

  /**
   * Set label based on corresponding host property.

   */
  setLabel(label): void;

  /**
   * Set callback to be called when label changes.
   */
  setLabelChangedCallback(callback: (hasLabel: boolean, label: HTMLElement) => void): void;
}
