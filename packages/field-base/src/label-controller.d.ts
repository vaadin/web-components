/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
