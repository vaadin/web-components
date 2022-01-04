/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin to delegate properties and attributes to a target element.
 */
export declare function DelegateStateMixin<T extends Constructor<HTMLElement>>(
  base: T
): T & Constructor<DelegateStateMixinClass>;

export declare class DelegateStateMixinClass {
  /**
   * A target element to which attributes and properties are delegated.
   */
  stateTarget: HTMLElement | null;
}
