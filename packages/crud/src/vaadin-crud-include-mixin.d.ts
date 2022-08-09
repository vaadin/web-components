/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function IncludedMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<IncludedMixinClass> & T;

export declare class IncludedMixinClass {
  /**
   * A list of item fields that should not be mapped to form fields.
   *
   * When [`include`](#/elements/vaadin-crud-form#property-include) is defined, this property is ignored.
   *
   * Default is to exclude any private property.
   */
  exclude: RegExp | string | null;

  /**
   * A list of item properties that should be mapped to form fields.
   *
   * When it is defined [`exclude`](#/elements/vaadin-crud-form#property-exclude) is ignored.
   */
  include: string[] | string | undefined;
}
