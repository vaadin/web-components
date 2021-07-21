/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ClearButtonMixin } from './clear-button-mixin.js';
import { DelegateFocusMixin } from './delegate-focus-mixin.js';
import { FieldAriaMixin } from './field-aria-mixin.js';
import { InputPropsMixin } from './input-props-mixin.js';

/**
 * A mixin to provide logic for vaadin-text-field and related components.
 */
declare function InputFieldMixin<T extends new (...args: any[]) => {}>(base: T): T & InputFieldMixinConstructor;

interface InputFieldMixinConstructor {
  new (...args: any[]): InputFieldMixin;
}

interface InputFieldMixin extends ClearButtonMixin, DelegateFocusMixin, FieldAriaMixin, InputPropsMixin {
  readonly inputElement: HTMLElement | undefined;

  /**
   * Whether the value of the control can be automatically completed by the browser.
   * List of available options at:
   * https://developer.mozilla.org/en/docs/Web/HTML/Element/input#attr-autocomplete
   */
  autocomplete: string | undefined;

  /**
   * This is a property supported by Safari that is used to control whether
   * autocorrection should be enabled when the user is entering/editing the text.
   * Possible values are:
   * on: Enable autocorrection.
   * off: Disable autocorrection.
   */
  autocorrect: 'on' | 'off' | undefined;

  /**
   * This is a property supported by Safari and Chrome that is used to control whether
   * autocapitalization should be enabled when the user is entering/editing the text.
   * Possible values are:
   * characters: Characters capitalization.
   * words: Words capitalization.
   * sentences: Sentences capitalization.
   * none: No capitalization.
   */
  autocapitalize: 'on' | 'off' | 'none' | 'characters' | 'words' | 'sentences' | undefined;

  /**
   * Specify that the value should be automatically selected when the field gains focus.
   */
  autoselect: boolean;

  /**
   * The value of the field.
   */
  value: string;

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   */
  checkValidity(): boolean;
}

export { InputFieldMixin, InputFieldMixinConstructor };
