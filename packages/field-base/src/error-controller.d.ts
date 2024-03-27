/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that manages the error message node content.
 */
export class ErrorController extends SlotController {
  /**
   * ID attribute value set on the error message element.
   */
  readonly errorId: string;

  /**
   * String used for the error message text content.
   */
  protected errorMessage: string | null | undefined;

  /**
   * Set to true when the host element is invalid.
   */
  protected invalid: boolean;

  /**
   * Set the error message element text content.
   */
  setErrorMessage(errorMessage: string | null | undefined): void;

  /**
   * Set invalid state for detecting whether to show error message.
   */
  setInvalid(invalid: boolean): void;
}
