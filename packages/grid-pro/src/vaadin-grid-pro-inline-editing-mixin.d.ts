/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function InlineEditingMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<InlineEditingMixinClass> & T;

export declare class InlineEditingMixinClass {
  /**
   * When true, pressing Enter while in cell edit mode
   * will move focus to the editable cell in the next row
   * (Shift + Enter - same, but for previous row).
   * @attr {boolean} enter-next-row
   */
  enterNextRow: boolean | null | undefined;

  /**
   * When true, after moving to next or previous editable cell using
   * Tab / Shift+Tab, it will be focused without edit mode.
   *
   * When `enterNextRow` is true, pressing Enter will also
   * preserve edit mode, otherwise, it will have no effect.
   * @attr {boolean} single-cell-edit
   */
  singleCellEdit: boolean | null | undefined;

  /**
   * When true, the grid enters cell edit mode on a single click
   * instead of the default double click.
   * @attr {boolean} edit-on-click
   */
  editOnClick: boolean | null | undefined;

  protected _stopEdit(shouldCancel?: boolean, shouldRestoreFocus?: boolean): void;

  protected _switchEditCell(e: KeyboardEvent): void;
}
