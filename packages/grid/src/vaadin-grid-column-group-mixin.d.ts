/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ColumnBaseMixinClass } from './vaadin-grid-column.js';

export interface GridColumnGroupMixin<TItem, Column extends ColumnBaseMixinClass<TItem, Column>>
  extends ColumnBaseMixinClass<TItem, Column> {
  /**
   * Flex grow ratio for the column group as the sum of the ratios of its child columns.
   * @attr {number} flex-grow
   */
  readonly flexGrow: number | null | undefined;

  /**
   * Width of the column group as the sum of the widths of its child columns.
   */
  readonly width: string | null | undefined;
}
