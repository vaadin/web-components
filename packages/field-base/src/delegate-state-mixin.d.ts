/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin to delegate properties and attributes to a target element.
 */
export declare function DelegateStateMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DelegateStateMixinClass> & T;

export declare class DelegateStateMixinClass {
  /**
   * A target element to which attributes and properties are delegated.
   */
  stateTarget: HTMLElement | null;
}
