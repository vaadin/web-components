/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlottedContentController } from '@vaadin/component-base/src/slotted-content-controller.js';

/**
 * A controller to manage the label element.
 */
export class LabelController extends SlottedContentController {
  constructor(host: HTMLElement);

  /**
   * String used for the label.
   */
  protected label: string | null | undefined;

  /**
   * Set label based on corresponding host property.
   */
  setLabel(label: string | null | undefined): void;
}
