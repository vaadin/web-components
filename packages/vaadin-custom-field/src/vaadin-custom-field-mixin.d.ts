import { CustomFieldI18n } from './interfaces';

export { CustomFieldMixin };

declare function CustomFieldMixin<T extends new (...args: any[]) => {}>(base: T): T & CustomFieldMixinConstructor;

interface CustomFieldMixinConstructor {
  new (...args: any[]): CustomFieldMixin;
}

export { CustomFieldMixinConstructor };

interface CustomFieldMixin {
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
}
