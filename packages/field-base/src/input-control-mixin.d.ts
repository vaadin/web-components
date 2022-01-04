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
import { InputMixinClass } from './input-mixin.js';
import { LabelMixinClass } from './label-mixin.js';
import { ValidateMixinClass } from './validate-mixin.js';

/**
 * A mixin to provide shared logic for the editable form input controls.
 */
export declare function InputControlMixin<T extends Constructor<HTMLElement>>(
  base: T
): T &
  Constructor<ControllerMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<InputConstraintsMixinClass> &
  Constructor<InputControlMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<ValidateMixinClass>;

export declare class InputControlMixinClass {
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
