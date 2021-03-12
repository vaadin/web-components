export type CustomFieldParseValueFn = (value: string) => Array<unknown>;

export type CustomFieldFormatValueFn = (inputValues: Array<unknown>) => string;

export interface CustomFieldI18n {
  parseValue: CustomFieldParseValueFn;

  formatValue: CustomFieldFormatValueFn;
}

/**
 * Fired when the `invalid` property changes.
 */
export type CustomFieldInvalidChanged = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type CustomFieldValueChanged = CustomEvent<{ value: string }>;

export interface CustomFieldElementEventMap {
  'invalid-changed': CustomFieldInvalidChanged;

  'value-changed': CustomFieldValueChanged;
}

export interface CustomFieldEventMap extends HTMLElementEventMap, CustomFieldElementEventMap {}
