/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from './slot-controller.js';

/**
 * A controller that observes slotted element mutations, especially ID attribute
 * and the text content, and fires an event to notify host element about those.
 */
export class SlotObserveController extends SlotController {
  /**
   * Override to update default node, e.g. when restoring it.
   */
  protected applyDefaultNode(node: Node): void;

  /**
   * Setup the mutation observer on the node to update ID and notify host.
   * Node doesn't get observed automatically until this method is called.
   */
  protected observeNode(node: Node): void;
}
