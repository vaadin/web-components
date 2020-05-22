export type CustomFieldParseValueFn = (
  value: any
) => Array<any>;

export type CustomFieldFormatValueFn = (
  inputValues: Array<any>
) => any;

export type CustomFieldI18n = {
  parseValue: CustomFieldParseValueFn;
  formatValue: CustomFieldFormatValueFn;
};
