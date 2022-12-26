/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the summary element.
 */
export class SummarySlotController extends SlotChildObserveController {
  /**
   * String used for the summary.
   */
  protected summary: string | null | undefined;

  /**
   * Set summary based on corresponding host property.
   */
  setSummary(label: string | null | undefined): void;
}
