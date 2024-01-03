/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';

export declare function PasswordFieldMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<PasswordFieldMixinClass> &
  Constructor<SlotStylesMixinClass> &
  T;

export declare class PasswordFieldMixinClass {
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
