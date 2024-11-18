/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';

/**
 * Fired when the `invalid` property changes.
 */
export type RadioGroupInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type RadioGroupValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired whenever the field is validated.
 */
export type RadioGroupValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface RadioGroupCustomEventMap {
  'invalid-changed': RadioGroupInvalidChangedEvent;

  'value-changed': RadioGroupValueChangedEvent;

  validated: RadioGroupValidatedEvent;
}

export interface RadioGroupEventMap extends HTMLElementEventMap, RadioGroupCustomEventMap {}

/**
 * A mixin providing common radio-group functionality.
 */
export declare function RadioGroupMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<RadioGroupMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class RadioGroupMixinClass {
  /**
   * The name of the control, which is submitted with the form data.
   */
  name: string | null | undefined;

  /**
   * The value of the radio group.
   */
  value: string | null | undefined;

  /**
   * When present, the user cannot modify the value of the radio group.
   * The property works similarly to the `disabled` property.
   * While the `disabled` property disables all the radio buttons inside the group,
   * the `readonly` property disables only unchecked ones.
   */
  readonly: boolean;
}
