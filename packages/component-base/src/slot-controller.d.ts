/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ReactiveController } from 'lit';

export class SlotController implements ReactiveController {
  constructor(
    host: HTMLElement,
    slotName: string,
    slotFactory?: () => HTMLElement,
    slotInitializer?: (host: HTMLElement, node: HTMLElement) => void
  );

  hostConnected(): void;

  /**
   * The controller host element.
   */
  host: HTMLElement;

  /**
   * The slotted node managed by the controller.
   */
  node: HTMLElement;

  /**
   * Return a reference to the node managed by the controller.
   */
  getSlotChild(): Node;

  protected initialized: boolean;

  protected defaultNode: Node;

  /**
   * Override to initialize the newly added custom node.
   */
  protected initCustomNode(node: Node): void;

  /**
   * Override to cleanup slotted node when it's removed.
   */
  protected teardownNode(node: Node): void;

  /**
   * Setup the observer to manage slot content changes.
   */
  protected observe(): void;
}
