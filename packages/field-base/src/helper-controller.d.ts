/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
