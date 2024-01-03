/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function SplitLayoutMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<SplitLayoutMixinClass> & T;

export declare class SplitLayoutMixinClass {
  /**
   * The split layout's orientation. Possible values are: `horizontal|vertical`.
   */
  orientation: 'horizontal' | 'vertical';
}
