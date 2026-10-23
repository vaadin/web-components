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
   * Set ID on the node. Override to also apply host property values to
   * the node. Called on every update, also when the node text changes.
   */
  protected updateNode(node: Node): void;
}
