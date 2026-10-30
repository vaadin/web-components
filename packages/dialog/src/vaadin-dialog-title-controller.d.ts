/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the dialog title element and to label the dialog by it.
 */
export class TitleController extends SlotChildObserveController {
  constructor(host: HTMLElement);

  /**
   * String used for the title.
   */
  protected title: string | null | undefined;

  /**
   * The ARIA heading level of the default title.
   */
  protected level: number;

  /**
   * Set title based on the corresponding host property.
   */
  setTitle(title: string | null | undefined): void;

  /**
   * Set heading level based on the corresponding host property.
   */
  setLevel(level: number): void;
}
