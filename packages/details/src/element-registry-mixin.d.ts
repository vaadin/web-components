/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ElementRegistryMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ElementRegistryMixinClass> & T;

export declare class ElementRegistryMixinClass {
  static registerStyles(is: string): void;

  static register(): void;
}
