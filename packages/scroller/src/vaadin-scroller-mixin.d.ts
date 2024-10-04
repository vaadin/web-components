/**
 * @license
 * Copyright (c) 2020 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';

export declare function ScrollerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<FocusMixinClass> & Constructor<ScrollerMixinClass> & T;

export declare class ScrollerMixinClass {
  /**
   * This property indicates the scroll direction. Supported values are `vertical`, `horizontal`, `none`.
   * When `scrollDirection` is undefined scrollbars will be shown in both directions.
   * @attr {string} scroll-direction
   */
  scrollDirection: 'horizontal' | 'none' | 'vertical' | undefined;

  /**
   * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
   */
  tabindex: number;
}
