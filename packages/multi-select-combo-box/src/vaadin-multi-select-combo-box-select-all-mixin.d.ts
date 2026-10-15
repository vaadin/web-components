/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin that manages the select all button of `<vaadin-multi-select-combo-box>`.
 */
export declare function MultiSelectComboBoxSelectAllMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<MultiSelectComboBoxSelectAllMixinClass> & T;

export declare class MultiSelectComboBoxSelectAllMixinClass {
  /**
   * Set to true to show a button above the dropdown items for selecting
   * or deselecting all items matching the current filter at once. Items
   * that do not match the filter keep their selection state.
   *
   * The button is only supported with the `items` API. It is not shown
   * when using `dataProvider`.
   * @attr {boolean} select-all-button-visible
   */
  selectAllButtonVisible: boolean;
}
