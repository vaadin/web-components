/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ListMixinClass } from './vaadin-list-mixin.js';

/**
 * A mixin for `nav` elements, facilitating multiple selection of childNodes.
 */
export declare function MultiSelectListMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ListMixinClass> & Constructor<ListMixinClass> & T;

export declare class MultiSelectListMixinClass {
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
