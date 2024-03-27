/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { ReactiveController } from 'lit';

export class SlotTargetController implements ReactiveController {
  /**
   * The source `<slot>` element to copy nodes from.
   */
  protected sourceSlot: HTMLSlotElement;

  /**
   * Function used to get a reference to slot target.
   */
  protected targetFactory: () => HTMLElement;

  /**
   * Function called after copying nodes to target.
   */
  protected copyCallback?: (nodes: HTMLElement[]) => void;

  constructor(
    sourceSlot: HTMLSlotElement,
    targetFactory: () => HTMLElement,
    copyCallback?: (nodes: HTMLElement[]) => void,
  );

  hostConnected(): void;
}
