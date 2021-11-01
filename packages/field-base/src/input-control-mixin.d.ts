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
import { InputHost } from './input-mixin.js';
import { LabelHost } from './label-mixin.js';
import { ValidateHost } from './validate-mixin.js';

export declare class InputControlHost {
  /**
   * If true, the input text gets fully selected when the field is focused using click or touch / tap.
   */
  autoselect: boolean;

  /**
   * Set to true to display the clear icon which clears the input.
   * @attr {boolean} clear-button-visible
   */
  clearButtonVisible: boolean;

  /**
   * The name of this field.
   */
  name: string;

  /**
   * A hint to the user of what can be entered in the field.
   */
  placeholder: string;

  /**
   * When present, it specifies that the field is read-only.
   */
  readonly: boolean;

  /**
   * The text usually displayed in a tooltip popup when the mouse is over the field.
   */
  title: string;
}

/**
 * A mixin to provide shared logic for the editable form input controls.
 */
export declare function InputControlMixin<T extends Constructor<HTMLElement>>(
  base: T
): T &
  Constructor<InputControlHost> &
  Pick<typeof InputControlHost, keyof typeof InputControlHost> &
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
  Constructor<InputHost> &
  Pick<typeof InputHost, keyof typeof InputHost> &
  Constructor<KeyboardHost> &
  Pick<typeof KeyboardHost, keyof typeof KeyboardHost> &
  Constructor<LabelHost> &
  Pick<typeof LabelHost, keyof typeof LabelHost> &
  Constructor<ValidateHost> &
  Pick<typeof ValidateHost, keyof typeof ValidateHost>;
