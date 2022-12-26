/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotObserveController } from '@vaadin/component-base/src/slot-observe-controller.js';

/**
 * A controller that manages the helper node content.
 */
export class HelperController extends SlotObserveController {
  /**
   * String used for the helper text.
   */
  helperText: string | null | undefined;

  /**
   * Set helper text based on corresponding host property.
   */
  setHelperText(helperText: string): void;
}
