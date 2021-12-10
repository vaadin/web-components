/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotContentController } from '@vaadin/component-base/src/slot-content-controller.js';

/**
 * A controller manage the helper node content.
 */
export class HelperController extends SlotContentController {
  /**
   * String used for the helper text.
   */
  helperText: string | null | undefined;

  helperId: string;

  readonly helperNode?: HTMLElement;

  /**
   * Set helper text based on corresponding host property.
   */
  setHelperText(helperText: string): void;
}
