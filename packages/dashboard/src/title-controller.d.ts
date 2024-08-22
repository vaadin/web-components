/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the widget or section title element.
 */
export class TitleController extends SlotChildObserveController {
  constructor(host: HTMLElement);

  /**
   * String used for the title.
   */
  protected title: string | null | undefined;

  /**
   * Set title based on corresponding host property.
   */
  setTitle(title: string | null | undefined): void;
}
