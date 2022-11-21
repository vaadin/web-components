/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function RowStateMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<RowStateMixinClass> & T;

export declare class RowStateMixinClass {
  /**
   * Override to change the header row state based on the index.
   */
  protected _updateHeaderRow(headerRow: HTMLTableRowElement, index: number, rows: HTMLTableRowElement): void;

  /**
   * Override to change the footer row state based on the index.
   * @protected
   */
  protected _updateFooterRow(footerRow: HTMLTableRowElement, index: number, rows: HTMLTableRowElement): void;
}
