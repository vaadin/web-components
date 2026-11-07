/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ReactiveController } from 'lit';

/**
 * A controller that creates an internal node in a named slot of the host.
 * The node is not supposed to be replaced, so the controller does not observe the slot.
 * It does not access the shadow root and can be added before the first render.
 */
export class InternalSlotController implements ReactiveController {
  /**
   * The controller host element.
   */
  host: HTMLElement;

  /**
   * The node managed by the controller.
   */
  node: HTMLElement | null;

  /**
   * The name of the slot to put the node in.
   */
  protected slotName: string;

  /**
   * The tag name of the node to create.
   */
  protected tagName: string;

  /**
   * Function to call once when the node is created.
   */
  protected initializer?: (node: HTMLElement, host: HTMLElement) => void;

  constructor(
    host: HTMLElement,
    slotName: string,
    tagName: string,
    initializer?: (node: HTMLElement, host: HTMLElement) => void,
  );

  hostConnected(): void;
}
