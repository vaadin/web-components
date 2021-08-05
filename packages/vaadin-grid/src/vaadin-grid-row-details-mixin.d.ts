import { GridRowDetailsRenderer } from './interfaces';

declare function RowDetailsMixin<TItem, T extends new (...args: any[]) => {}>(
  base: T
): T & RowDetailsMixinConstructor<TItem>;

interface RowDetailsMixinConstructor<TItem> {
  new (...args: any[]): RowDetailsMixin<TItem>;
}

interface RowDetailsMixin<TItem> {
  /**
   * An array containing references to items with open row details.
   */
  detailsOpenedItems: Array<TItem>;

  /**
   * Custom function for rendering the content of the row details.
   * Receives three arguments:
   *
   * - `root` The row details content DOM element. Append your content to it.
   * - `grid` The `<vaadin-grid>` element.
   * - `model` The object with the properties related with
   *   the rendered item, contains:
   *   - `model.index` The index of the item.
   *   - `model.item` The item.
   *   - `model.level` The number of the item's tree sublevel, starts from 0.
   *   - `model.expanded` True if the item's tree sublevel is expanded.
   *   - `model.selected` True if the item is selected.
   */
  rowDetailsRenderer: GridRowDetailsRenderer<TItem> | null | undefined;

  _detailsCells: HTMLElement[] | undefined;

  _configureDetailsCell(cell: HTMLElement): void;

  _toggleDetailsCell(row: HTMLElement, detailsOpened: boolean): void;

  _updateDetailsCellHeights(): void;

  _isDetailsOpened(item: TItem): boolean;

  /**
   * Open the details row of a given item.
   */
  openItemDetails(item: TItem): void;

  /**
   * Close the details row of a given item.
   */
  closeItemDetails(item: TItem): void;
}

export { RowDetailsMixin, RowDetailsMixinConstructor };
