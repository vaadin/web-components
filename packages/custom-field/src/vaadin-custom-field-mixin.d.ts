/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';

export type CustomFieldParseValueFn = (value: string) => unknown[];

export type CustomFieldFormatValueFn = (inputValues: unknown[]) => string;

/**
 * A mixin providing common custom field functionality.
 */
export declare function CustomFieldMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<CustomFieldMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class CustomFieldMixinClass {
  /**
   * Array of available input nodes
   */
  readonly inputs: HTMLElement[] | undefined;

  /**
   * A function to format the values of the individual fields contained by
   * the custom field into a single component value. The function receives
   * an array of all values of the individual fields in the order of their
   * presence in the DOM, and must return a single component value.
   * This function is called each time a value of an internal field is
   * changed.
   *
   * Example:
   * ```js
   * customField.formatValue = (fieldValues) => {
   *   return fieldValues.join("-");
   * }
   * ```
   */
  formatValue: CustomFieldFormatValueFn | undefined;

  /**
   * A function to parse the component value into values for the individual
   * fields contained by the custom field. The function receives the
   * component value, and must return an array of values for the individual
   * fields in the order of their presence in the DOM.
   * The function is called each time the value of the component changes.
   *
   * Example:
   * ```js
   * customField.parseValue = (componentValue) => {
   *   return componentValue.split("-");
   * }
   * ```
   */
  parseValue: CustomFieldParseValueFn | undefined;

  /**
   * The name of the control, which is submitted with the form data.
   */
  name: string | null | undefined;

  /**
   * The value of the field. When wrapping several inputs, it will contain `\t`
   * (Tab character) as a delimiter indicating parts intended to be used as the
   * corresponding inputs values.
   * Use the [`formatValue`](#/elements/vaadin-custom-field#property-formatValue)
   * and [`parseValue`](#/elements/vaadin-custom-field#property-parseValue)
   * properties to customize this behavior.
   */
  value: string | null | undefined;
}
