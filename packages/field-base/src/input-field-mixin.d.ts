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
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import type { DelegateFocusMixinClass } from './delegate-focus-mixin.js';
import type { DelegateStateMixinClass } from './delegate-state-mixin.js';
import type { FieldMixinClass } from './field-mixin.js';
import type { InputConstraintsMixinClass } from './input-constraints-mixin.js';
import type { InputControlMixinClass } from './input-control-mixin.js';
import type { InputMixinClass } from './input-mixin.js';
import type { LabelMixinClass } from './label-mixin.js';
import type { SlotStylesMixinClass } from './slot-styles-mixin.js';
import type { ValidateMixinClass } from './validate-mixin.js';

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
  Constructor<SlotStylesMixinClass> &
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
