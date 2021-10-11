/**
 * @license
 * Copyright (c) 2019 - 2021 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0 (CVDLv4).
 * See <a href="https://vaadin.com/license/cvdl-4.0">the website</a> for the complete license.
 */

declare function InlineEditingMixin<T extends new (...args: any[]) => {}>(base: T): T & InlineEditingMixinConstructor;

interface InlineEditingMixinConstructor {
  new (...args: any[]): InlineEditingMixin;
}

interface InlineEditingMixin {
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

  _checkImports(): void;

  _stopEdit(shouldCancel?: boolean, shouldRestoreFocus?: boolean): void;

  _switchEditCell(e: KeyboardEvent): void;
}

export { InlineEditingMixin, InlineEditingMixinConstructor };
