/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to provide disabled property for field components.
 */
declare const DisabledMixin: <T>(superClass: T) => Constructor<DisabledMixinInterface> & T;

declare type Constructor<T> = new (...args: any[]) => T;

declare class DisabledMixinInterface {
  /**
   * If true, the user cannot interact with this element.
   */
  disabled: boolean;
}

export { DisabledMixin };
