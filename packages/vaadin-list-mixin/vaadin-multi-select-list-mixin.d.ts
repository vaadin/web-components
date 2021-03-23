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

  _onMultipleClick(event: MouseEvent): void;
}

export { MultiSelectListMixin, MultiSelectListMixinConstructor };
