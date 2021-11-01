/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledHost } from '@vaadin/component-base/src/disabled-mixin.js';
import { FocusHost } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardHost } from '@vaadin/component-base/src/keyboard-mixin.js';
import { DelegateFocusHost } from './delegate-focus-mixin.js';
import { DelegateStateHost } from './delegate-state-mixin.js';
import { FieldHost } from './field-mixin.js';
import { InputConstraintsHost } from './input-constraints-mixin.js';
import { InputControlHost } from './input-control-mixin.js';
import { InputHost } from './input-mixin.js';
import { LabelHost } from './label-mixin.js';
import { ValidateHost } from './validate-mixin.js';

export declare class InputFieldHost {
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
}

/**
 * A mixin to provide logic for vaadin-text-field and related components.
 */
export declare function InputFieldMixin<T extends Constructor<HTMLElement>>(
  base: T
): T &
  Constructor<InputFieldHost> &
  Pick<typeof InputFieldHost, keyof typeof InputFieldHost> &
  Constructor<DelegateFocusHost> &
  Pick<typeof DelegateFocusHost, keyof typeof DelegateFocusHost> &
  Constructor<DelegateStateHost> &
  Pick<typeof DelegateStateHost, keyof typeof DelegateStateHost> &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Constructor<FieldHost> &
  Pick<typeof FieldHost, keyof typeof FieldHost> &
  Constructor<FocusHost> &
  Pick<typeof FocusHost, keyof typeof FocusHost> &
  Constructor<InputConstraintsHost> &
  Pick<typeof InputConstraintsHost, keyof typeof InputConstraintsHost> &
  Constructor<InputControlHost> &
  Pick<typeof InputControlHost, keyof typeof InputControlHost> &
  Constructor<InputHost> &
  Pick<typeof InputHost, keyof typeof InputHost> &
  Constructor<KeyboardHost> &
  Pick<typeof KeyboardHost, keyof typeof KeyboardHost> &
  Constructor<LabelHost> &
  Pick<typeof LabelHost, keyof typeof LabelHost> &
  Constructor<ValidateHost> &
  Pick<typeof ValidateHost, keyof typeof ValidateHost>;
