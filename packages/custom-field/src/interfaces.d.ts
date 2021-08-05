/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
export type CustomFieldParseValueFn = (value: string) => Array<unknown>;

export type CustomFieldFormatValueFn = (inputValues: Array<unknown>) => string;

export interface CustomFieldI18n {
  parseValue: CustomFieldParseValueFn;

  formatValue: CustomFieldFormatValueFn;
}
