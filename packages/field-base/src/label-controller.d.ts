/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotObserveController } from '@vaadin/component-base/src/slot-observe-controller.js';

/**
 * A controller to manage the label element.
 */
export class LabelController extends SlotObserveController {
  /**
   * String used for the label.
   */
  protected label: string | null | undefined;

  /**
   * Set label based on corresponding host property.
   */
  setLabel(label: string | null | undefined): void;
}
