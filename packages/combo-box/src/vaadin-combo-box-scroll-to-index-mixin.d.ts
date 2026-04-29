/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ComboBoxScrollToIndexMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxScrollToIndexMixinClass> & T;

export declare class ComboBoxScrollToIndexMixinClass {
  /**
   * Scrolls the dropdown to the item at the given index and sets it as the
   * focused (highlighted) item. Safe to call before the dropdown is opened
   * or while the data provider is loading: the call is queued and executed
   * once the overlay is open and not loading.
   *
   * Because this sets the focused item, closing the dropdown without an
   * explicit selection change (e.g. via outside click or blur) will commit
   * the focused item as `selectedItem`. In the typical use case (scroll to
   * the currently selected item) this is a no-op; callers scrolling to a
   * different index should be aware of this behavior.
   *
   * @param index Index of the item to scroll to
   */
  scrollToIndex(index: number): void;
}
