/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ReactiveController } from 'lit';

export class SlotController implements ReactiveController {
  constructor(node: HTMLElement);

  hostConnected(): void;

  /**
   * The controller host element.
   */
  host: HTMLElement;

  slotName: string;

  initialized: boolean;
}
