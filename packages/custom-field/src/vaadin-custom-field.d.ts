/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/vaadin-element-mixin.js';
import { FieldAriaMixin } from '@vaadin/field-base/src/field-aria-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { LabelMixin } from '@vaadin/field-base/src/label-mixin.js';
import { CustomFieldI18n } from './interfaces';

declare class CustomField extends FieldAriaMixin(LabelMixin(FocusMixin(ThemableMixin(ElementMixin(HTMLElement))))) {
  /**
   * Array of available input nodes
   */
  readonly inputs: HTMLElement[] | undefined;

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * _i18n_ object or just the property you want to modify.
   *
   * The object has the following JSON structure:
   *
   * ```
   * {
   *   // A function to format given `Array` as
   *   // component value. Array is list of all internal values
   *   // in the order of their presence in the DOM
   *   // This function is called each time the internal input
   *   // value is changed.
   *   formatValue: inputValues => {
   *     // returns a representation of the given array of values
   *     // in the form of string with delimiter characters
   *   },
   *
   *   // A function to parse the given value to an `Array` in the format
   *   // of the list of all internal values
   *   // in the order of their presence in the DOM
   *   // This function is called when value of the
   *   // custom field is set.
   *   parseValue: value => {
   *     // returns the array of values from parsed value string.
   *   }
   * }
   * ```
   */
  i18n: CustomFieldI18n;

  /**
   * The name of the control, which is submitted with the form data.
   */
  name: string | null | undefined;

  /**
   * The value of the field. When wrapping several inputs, it will contain `\t`
   * (Tab character) as a delimiter indicating parts intended to be used as the
   * corresponding inputs values. Use the [`i18n`](#/elements/vaadin-custom-field#property-i18n)
   * property to customize this behavior.
   */
  value: string | null | undefined;

  /**
   * Returns true if the current inputs values satisfy all constraints (if any).
   */
  checkValidity(): boolean;
}

export { CustomField };
