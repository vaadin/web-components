/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ReactiveController } from 'lit';

export class SlotTargetController implements ReactiveController {
  constructor(
    sourceSlot: HTMLSlotElement,
    targetFactory: () => HTMLElement,
    copyCallback?: (nodes: HTMLElement[]) => void
  );

  hostConnected(): void;

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
}
