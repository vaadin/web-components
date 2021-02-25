import { ListOrientation } from './interfaces';

/**
 * A mixin for `nav` elements, facilitating navigation and selection of childNodes.
 */
declare function ListMixin<T extends new (...args: any[]) => {}>(base: T): T & ListMixinConstructor;

interface ListMixinConstructor {
  new (...args: any[]): ListMixin;
}

interface ListMixin {
  readonly focused: Element | null;

  readonly _isRTL: boolean;

  readonly _scrollerElement: HTMLElement;

  readonly _vertical: boolean;

  /**
   * Used for mixin detection because `instanceof` does not work with mixins.
   */
  _hasVaadinListMixin: boolean;

  /**
   * The index of the item selected in the items array.
   * Note: Not updated when used in `multiple` selection mode.
   */
  selected: number | null | undefined;

  /**
   * Define how items are disposed in the dom.
   * Possible values are: `horizontal|vertical`.
   * It also changes navigation keys from left/right to up/down.
   */
  orientation: ListOrientation;

  /**
   * The list of items from which a selection can be made.
   * It is populated from the elements passed to the light DOM,
   * and updated dynamically when adding or removing items.
   *
   * The item elements must implement `Vaadin.ItemMixin`.
   *
   * Note: unlike `<vaadin-combo-box>`, this property is read-only,
   * so if you want to provide items by iterating array of data,
   * you have to use `dom-repeat` and place it to the light DOM.
   */
  readonly items: Element[] | undefined;

  ready(): void;

  _filterItems(array: Element[]): Element[];

  _onClick(event: MouseEvent): void;

  _searchKey(currentIdx: number, key: string): number;

  _onKeydown(event: KeyboardEvent): void;

  _getAvailableIndex(idx: number, increment: number, condition: (p0: Element) => boolean): number;

  _isItemHidden(item: Element): boolean;

  _setFocusable(idx: number): void;

  _focus(idx: number): void;

  focus(): void;

  /**
   * Scroll the container to have the next item by the edge of the viewport.
   */
  _scrollToItem(idx: number): void;

  _scroll(pixels: number): void;
}

export { ListMixin, ListMixinConstructor };
