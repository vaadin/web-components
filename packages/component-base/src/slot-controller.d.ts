/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ReactiveController } from 'lit';

export class SlotController extends EventTarget implements ReactiveController {
  /**
   * The controller host element.
   */
  host: HTMLElement;

  /**
   * The slotted node managed by the controller.
   */
  node: HTMLElement | null;

  /**
   * The list of slotted nodes managed by the controller.
   * Contains at most one node unless `multiple` is set to `true`.
   */
  nodes: HTMLElement[];

  protected initialized: boolean;

  protected multiple: boolean;

  protected defaultNode: Node;

  protected defaultId: string;

  constructor(
    host: HTMLElement,
    slotName: string,
    tagName?: string,
    config?: {
      multiple?: boolean;
      observe?: boolean;
      useUniqueId?: boolean;
      uniqueIdPrefix?: string;
      initializer?(host: HTMLElement, node: HTMLElement): void;
    },
  );

  hostConnected(): void;

  /**
   * Return the list of nodes matching the slot managed by the controller.
   */
  getSlotChildren(): Node[];

  /**
   * Set up a node once it starts being managed by the controller,
   * either a default or a custom one. Runs `slotInitializer` by default.
   */
  protected initNode(node: Node): void;

  /**
   * Override to clean up a node once it is no longer managed by the controller.
   */
  protected teardownNode(node: Node): void;

  /**
   * Update the managed nodes to match the slot children, and attach the
   * default node when there are no custom ones. Calls `teardownNode()`
   * for the nodes that left the slot and `initNode()` for the new ones.
   * Does nothing until the controller is connected to the host.
   */
  protected update(): void;
}
