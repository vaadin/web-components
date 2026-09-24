/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller to manage the send button element.
 */
export class ButtonController extends SlotController {
  constructor(host: HTMLElement, initializer: (node: HTMLElement, host: HTMLElement) => void);

  /**
   * Applies localized text to the button.
   */
  setLabel(label: string): void;
}
