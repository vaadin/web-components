import { PolymerIronList } from './iron-list.js';

/**
 * This Element is used internally by vaadin-grid.
 */
declare class ScrollerElement extends PolymerIronList {
  readonly _firstVisibleIndex: number;

  readonly _lastVisibleIndex: number;

  size: number | null | undefined;

  _vidxOffset: number;

  _updateScrollerItem(item: HTMLTableRowElement, index: number): void;

  _afterScroll(): void;

  _getRowTarget(): void;

  _createScrollerRows(): void;

  _canPopulate(): void;

  scrollToIndex(index: number): void;

  _positionItems(): void;

  _increasePoolIfNeeded(count: number): void;

  /**
   * Assigns the data models to a given set of items.
   */
  _assignModels(itemSet?: number[]): void;

  _scrollHandler(): void;

  _render(): void;

  _itemsChanged(): void;

  _scrollToIndex(index: number): void;

  _resizeHandler(): void;
}

export { ScrollerElement };
