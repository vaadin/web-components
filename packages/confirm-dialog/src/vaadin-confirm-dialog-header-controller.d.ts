/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the confirm dialog header element and to label the dialog by it.
 */
export class HeaderController extends SlotChildObserveController {
  constructor(host: HTMLElement);

  /**
   * String used for the header.
   */
  protected header: string | null | undefined;

  /**
   * The ARIA heading level of the default header.
   */
  protected level: number | null | undefined;

  /**
   * Set header based on the corresponding host property.
   */
  setHeader(header: string | null | undefined): void;

  /**
   * Set heading level based on the corresponding host property.
   */
  setLevel(level: number | null | undefined): void;
}
