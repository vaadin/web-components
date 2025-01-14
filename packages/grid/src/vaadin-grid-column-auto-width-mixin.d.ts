/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ColumnAutoWidthMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ColumnAutoWidthMixinClass> & T;

export declare class ColumnAutoWidthMixinClass {
  /**
   * Updates the `width` of all columns which have `autoWidth` set to `true`.
   */
  recalculateColumnWidths(): void;
}
