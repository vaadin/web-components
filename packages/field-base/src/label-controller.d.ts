/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller to manage the label element.
 */
export class LabelController extends SlotController {
  /**
   * ID attribute value set on the label element.
   */
  labelId: string;

  /**
   * String used for the label.
   */
  protected label: string | null | undefined;

  /**
   * Set label based on corresponding host property.
   */
  setLabel(label: string | null | undefined): void;
}
