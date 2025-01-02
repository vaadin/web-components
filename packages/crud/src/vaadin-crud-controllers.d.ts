/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller for initializing slotted button.
 */
export class ButtonSlotController extends SlotController {
  constructor(host: HTMLElement);
}

/**
 * A controller for initializing slotted form.
 */
export class FormSlotController extends SlotController {
  constructor(host: HTMLElement);
}

/**
 * A controller for initializing slotted grid.
 */
export class GridSlotController extends SlotController {
  constructor(host: HTMLElement);
}
