/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ReactiveController } from 'lit';

export class SlotController implements ReactiveController {
  constructor(
    node: HTMLElement,
    slotName: string,
    slotFactory: () => HTMLElement,
    slotInitializer: (host: HTMLElement, node: HTMLElement) => void
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

  slotName: string;

  initialized: boolean;
}
