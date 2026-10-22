/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from './slot-controller.js';

/**
 * A controller that observes slotted element mutations, especially ID attribute
 * and the text content, and fires an event to notify host element about those.
 */
export class SlotChildObserveController extends SlotController {
  /**
   * Override to apply host property values to the node. Called on every
   * update, also when the node text changes, so only write values that differ.
   */
  protected updateNode(node: Node): void;

  /**
   * Apply property values to the node and notify the host. Call it when
   * a host property used by `updateNode()` changes.
   */
  protected update(): void;

  /**
   * Fire an event to notify the controller host about node changes.
   */
  protected _notifyChange(node: Node | null): void;
}
