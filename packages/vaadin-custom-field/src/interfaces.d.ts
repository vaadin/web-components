export type CustomFieldParseValueFn = (value: string) => Array<unknown>;

export type CustomFieldFormatValueFn = (inputValues: Array<unknown>) => string;

export interface CustomFieldI18n {
  parseValue: CustomFieldParseValueFn;

  formatValue: CustomFieldFormatValueFn;
}

/**
 * Fired when the `invalid` property changes.
 */
export type CustomFieldInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type CustomFieldValueChangedEvent = CustomEvent<{ value: string }>;

export interface CustomFieldElementEventMap {
  'invalid-changed': CustomFieldInvalidChangedEvent;

  'value-changed': CustomFieldValueChangedEvent;
}

export interface CustomFieldEventMap extends HTMLElementEventMap, CustomFieldElementEventMap {}
