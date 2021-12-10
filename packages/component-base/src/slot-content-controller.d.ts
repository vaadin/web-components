/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ReactiveController } from 'lit';

/**
 * A controller for observing content changes in a slot.
 */
export declare class SlotContentController implements ReactiveController {
  constructor(node: HTMLElement);

  hostConnected(): void;

  hostDisconnected(): void;

  /**
   * The controller host element.
   */
  host: HTMLElement;

  /**
   * Set to true after one-time initialization.
   */
  initialized: boolean;

  /**
   * A node currently assigned to the slot.
   */
  currentNode: HTMLElement;
}
