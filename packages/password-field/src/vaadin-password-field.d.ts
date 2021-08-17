/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';

declare class PasswordField extends TextField {
  /**
   * Set to true to hide the eye icon which toggles the password visibility.
   * @attr {boolean} reveal-button-hidden
   */
  revealButtonHidden: boolean;

  /**
   * True if the password is visible ([type=text]).
   * @attr {boolean} password-visible
   */
  readonly passwordVisible: boolean;

  /**
   * An object with translated strings used for localization.
   * It has the following structure and default values:
   *
   * ```
   * {
   *   // Translation of the reveal icon button accessible label
   *   reveal: 'Show password'
   * }
   * ```
   */
  i18n: { reveal: string };
}

export { PasswordField };
