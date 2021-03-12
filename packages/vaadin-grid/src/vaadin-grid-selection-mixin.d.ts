import { GridItem } from './interfaces';

declare function SelectionMixin<T extends new (...args: any[]) => {}>(base: T): T & SelectionMixinConstructor;

interface SelectionMixinConstructor {
  new (...args: any[]): SelectionMixin;
}

interface SelectionMixin {
  /**
   * An array that contains the selected items.
   */
  selectedItems: Array<GridItem | null> | null;
  _isSelected(item: GridItem): boolean;

  /**
   * Selects the given item.
   *
   * @param item The item object
   */
  selectItem(item: GridItem): void;

  /**
   * Deselects the given item if it is already selected.
   *
   * @param item The item object
   */
  deselectItem(item: GridItem): void;

  /**
   * Toggles the selected state of the given item.
   *
   * @param item The item object
   */
  _toggleItem(item: GridItem): void;
}

export { SelectionMixin, SelectionMixinConstructor };
