/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function A11yMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<A11yMixinClass> & T;

export declare class A11yMixinClass {
  /**
   * String used to label the grid to screen reader users.
   * @attr {string} accessible-name
   */
  accessibleName: string;
}
