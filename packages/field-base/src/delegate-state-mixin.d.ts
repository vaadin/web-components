/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to delegate properties and attributes to a target element.
 */
declare function DelegateStateMixin<T extends new (...args: any[]) => {}>(base: T): T & DelegateStateMixinConstructor;

interface DelegateStateMixinConstructor {
  new (...args: any[]): DelegateStateMixin;
}

interface DelegateStateMixin {
  /**
   * A target element to which attributes and properties are delegated.
   */
  stateTarget: HTMLElement | null;
}

export { DelegateStateMixinConstructor, DelegateStateMixin };
