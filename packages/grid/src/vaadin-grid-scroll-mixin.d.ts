/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ScrollMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<ScrollMixinClass> & T;

export declare class ScrollMixinClass {
  /**
   * Scroll to a flat index in the grid. The method doesn't take into account
   * the hierarchy of the items.
   *
   * @param index Row index to scroll to
   */
  protected _scrollToIndex(index: number): void;
}
