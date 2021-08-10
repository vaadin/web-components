/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to provide `value` property and `has-value` attribute.
 */
declare function ValueMixin<T extends new (...args: any[]) => {}>(base: T): T & ValueMixinConstructor;

interface ValueMixinConstructor {
  new (...args: any[]): ValueMixin;
}

interface ValueMixin {
  /**
   * The value of the field.
   */
  value: string;
}

export { ValueMixin, ValueMixinConstructor };
