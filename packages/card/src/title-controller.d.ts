/**
 * @license
 * Copyright (c) 2024 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller to manage the card title element.
 */
export class TitleController extends SlotController {
  constructor(host: HTMLElement);

  /**
   * Set title based on the corresponding host property.
   */
  setTitle(title: string): void;

  /**
   * Set heading level based on the corresponding host property.
   */
  setLevel(level: number): void;
}
