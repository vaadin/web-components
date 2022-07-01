/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import { DelegateFocusMixinClass } from './delegate-focus-mixin.js';
import { DelegateStateMixinClass } from './delegate-state-mixin.js';
import { FieldMixinClass } from './field-mixin.js';
import { InputConstraintsMixinClass } from './input-constraints-mixin.js';
import { InputControlMixinClass } from './input-control-mixin.js';
import { InputMixinClass } from './input-mixin.js';
import { LabelMixinClass } from './label-mixin.js';
import { ValidateMixinClass } from './validate-mixin.js';

/**
 * A mixin to provide logic for vaadin-text-field and related components.
 */
export declare function InputFieldMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<InputConstraintsMixinClass> &
  Constructor<InputControlMixinClass> &
  Constructor<InputFieldMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class InputFieldMixinClass {
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
  autocorrect: 'off' | 'on' | undefined;

  /**
   * This is a property supported by Safari and Chrome that is used to control whether
   * autocapitalization should be enabled when the user is entering/editing the text.
   * Possible values are:
   * characters: Characters capitalization.
   * words: Words capitalization.
   * sentences: Sentences capitalization.
   * none: No capitalization.
   */
  autocapitalize: 'characters' | 'none' | 'off' | 'on' | 'sentences' | 'words' | undefined;
}
