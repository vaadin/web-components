export type CustomFieldParseValueFn = (value: string) => Array<unknown>;

export type CustomFieldFormatValueFn = (inputValues: Array<unknown>) => string;

export interface CustomFieldI18n {
  parseValue: CustomFieldParseValueFn;
  formatValue: CustomFieldFormatValueFn;
}
