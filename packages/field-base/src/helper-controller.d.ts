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
 * A controller that manages the helper node content.
 */
export class HelperController extends SlotController {
  /**
   * String used for the helper text.
   */
  helperText: string | null | undefined;

  helperId: string;

  /**
   * Set helper text based on corresponding host property.
   */
  setHelperText(helperText: string): void;
}
