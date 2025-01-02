/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function GridFilterColumnMixin<T extends Constructor<HTMLElement>>(
  superclass: T,
): Constructor<GridFilterColumnMixinClass> & T;

export declare class GridFilterColumnMixinClass {
  /**
   * Text to display as the label of the column filter text-field.
   */
  header: string | null | undefined;

  /**
   * JS Path of the property in the item used for filtering the data.
   */
  path: string | null | undefined;
}
