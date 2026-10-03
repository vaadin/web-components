/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the button element.
 */
export class ButtonController extends SlotChildObserveController {
  constructor(host: HTMLElement);

  /**
   * String used for the default button label.
   */
  protected label: string | null | undefined;

  /**
   * Set button label based on corresponding host property.
   */
  setLabel(label: string | null | undefined): void;
}
