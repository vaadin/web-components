/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { SlotStylesMixin } from '@vaadin/field-base/src/slot-styles-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Fired when the `invalid` property changes.
 */
export type NumberFieldInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type NumberFieldValueChangedEvent = CustomEvent<{ value: string }>;

export interface NumberFieldCustomEventMap {
  'invalid-changed': NumberFieldInvalidChangedEvent;

  'value-changed': NumberFieldValueChangedEvent;
}

export interface NumberFieldEventMap extends HTMLElementEventMap, NumberFieldCustomEventMap {}

/**
 * `<vaadin-number-field>` is an input field web component that only accepts numeric input.
 *
 * ```html
 * <vaadin-number-field label="Balance"></vaadin-number-field>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-number-field>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name         | Description
 * ------------------|-------------------------
 * `increase-button` | Increase ("plus") button
 * `decrease-button` | Decrease ("minus") button
 *
 * Note, the `input-prevented` state attribute is not supported by `<vaadin-number-field>`.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class NumberField extends InputFieldMixin(SlotStylesMixin(ThemableMixin(ElementMixin(HTMLElement)))) {
  /**
   * Set to true to display value increase/decrease controls.
   * @attr {boolean} has-controls
   */
  hasControls: boolean;

  /**
   * The minimum value of the field.
   */
  min: number | null | undefined;

  /**
   * The maximum value of the field.
   */
  max: number | null | undefined;

  /**
   * Specifies the allowed number intervals of the field.
   */
  step: number;

  addEventListener<K extends keyof NumberFieldEventMap>(
    type: K,
    listener: (this: NumberField, ev: NumberFieldEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof NumberFieldEventMap>(
    type: K,
    listener: (this: NumberField, ev: NumberFieldEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-number-field': NumberField;
  }
}

export { NumberField };
