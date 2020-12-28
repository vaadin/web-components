import { GridItem, GridRowDetailsRenderer } from './interfaces';

declare function RowDetailsMixin<T extends new (...args: any[]) => {}>(base: T): T & RowDetailsMixinConstructor;

interface RowDetailsMixinConstructor {
  new (...args: any[]): RowDetailsMixin;
}

interface RowDetailsMixin {
  /**
   * An array containing references to items with open row details.
   */
  detailsOpenedItems: Array<GridItem | null> | null | undefined;

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
  rowDetailsRenderer: GridRowDetailsRenderer | null | undefined;

  _detailsCells: HTMLElement[] | undefined;

  _configureDetailsCell(cell: HTMLElement): void;

  _toggleDetailsCell(row: HTMLElement, item: GridItem): void;

  _updateDetailsCellHeights(): void;

  _isDetailsOpened(item: GridItem): boolean;

  /**
   * Open the details row of a given item.
   */
  openItemDetails(item: GridItem): void;

  /**
   * Close the details row of a given item.
   */
  closeItemDetails(item: GridItem): void;
}

export { RowDetailsMixin, RowDetailsMixinConstructor };
