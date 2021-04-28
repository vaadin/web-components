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
  detailsOpenedItems: Array<TItem | null> | null | undefined;

  _rowDetailsTemplate: HTMLTemplateElement | null;

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
   */
  rowDetailsRenderer: GridRowDetailsRenderer<TItem> | null | undefined;

  _detailsCells: HTMLElement[] | undefined;

  _configureDetailsCell(cell: HTMLElement): void;

  _toggleDetailsCell(row: HTMLElement, item: TItem): void;

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
