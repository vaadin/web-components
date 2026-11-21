/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlottedContentController } from '@vaadin/component-base/src/slotted-content-controller.js';

/**
 * A controller that manages the helper node content.
 */
export class HelperController extends SlottedContentController {
  constructor(host: HTMLElement);

  /**
   * String used for the helper text.
   */
  helperText: string | null | undefined;

  /**
   * Set helper text based on corresponding host property.
   */
  setHelperText(helperText: string): void;
}
