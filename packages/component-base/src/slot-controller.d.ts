/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ReactiveController } from 'lit';

export class SlotController extends EventTarget implements ReactiveController {
  constructor(
    host: HTMLElement,
    slotName: string,
    slotFactory?: () => HTMLElement,
    slotInitializer?: (host: HTMLElement, node: HTMLElement) => void,
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

  protected defaultId: string;

  protected attachDefaultNode(): Node | undefined;

  protected initNode(node: Node): void;

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
