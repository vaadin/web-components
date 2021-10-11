/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ListMixin, ListMixinConstructor } from './vaadin-list-mixin.js';

/**
 * A mixin for `nav` elements, facilitating multiple selection of childNodes.
 */
declare function MultiSelectListMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & MultiSelectListMixinConstructor & ListMixinConstructor;

interface MultiSelectListMixinConstructor {
  new (...args: any[]): MultiSelectListMixin;
}

interface MultiSelectListMixin extends ListMixin {
  /**
   * Specifies that multiple options can be selected at once.
   */
  multiple: boolean | null | undefined;

  /**
   * Array of indexes of the items selected in the items array
   * Note: Not updated when used in single selection mode.
   */
  selectedValues: number[] | null | undefined;
}

export { MultiSelectListMixin, MultiSelectListMixinConstructor };
