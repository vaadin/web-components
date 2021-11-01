/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare class DelegateStateHost {
  /**
   * A target element to which attributes and properties are delegated.
   */
  stateTarget: HTMLElement | null;
}

/**
 * A mixin to delegate properties and attributes to a target element.
 */
export declare function DelegateStateMixin<T extends Constructor<HTMLElement>>(
  base: T
): T & Constructor<DelegateStateHost> & Pick<typeof DelegateStateHost, keyof typeof DelegateStateHost>;
