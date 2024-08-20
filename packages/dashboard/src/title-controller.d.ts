/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the widget title element.
 */
export class TitleController extends SlotChildObserveController {
  /**
   * String used for the widget title.
   */
  protected widgetTitle: string | null | undefined;

  /**
   * Set widget title based on corresponding host property.
   */
  setWidgetTitle(widgetTitle: string | null | undefined): void;
}
