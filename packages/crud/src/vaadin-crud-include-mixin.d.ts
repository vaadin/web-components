/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

declare function IncludedMixin<T extends new (...args: any[]) => {}>(base: T): T & IncludedMixinConstructor;

interface IncludedMixinConstructor {
  new (...args: any[]): IncludedMixin;
}

interface IncludedMixin {
  /**
   * A list of item fields that should not be mapped to form fields.
   *
   * When [`include`](#/elements/vaadin-crud-form#property-include) is defined, this property is ignored.
   *
   * Default is to exclude any private property.
   */
  exclude: string | RegExp | null;

  /**
   * A list of item properties that should be mapped to form fields.
   *
   * When it is defined [`exclude`](#/elements/vaadin-crud-form#property-exclude) is ignored.
   */
  include: string | string[] | undefined;
}

export { IncludedMixin, IncludedMixinConstructor };
