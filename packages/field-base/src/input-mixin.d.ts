/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to store the reference to an input element
 * and add input and change event listeners to it.
 */
declare function InputMixin<T extends new (...args: any[]) => {}>(base: T): T & InputMixinConstructor;

interface InputMixinConstructor {
  new (...args: any[]): InputMixin;
}

interface InputMixin {
  /**
   * A reference to the input element controlled by the mixin.
   * Any component implementing this mixin is expected to provide it
   * by using `this._setInputElement(input)` Polymer API.
   *
   * A typical case is using `InputController` that does this automatically.
   * However, the input element does not have to always be native <input>:
   * as an example, <vaadin-combo-box-light> accepts other components.
   */
  readonly inputElement: HTMLInputElement;

  /**
   * The value of the field.
   */
  value: string;

  /**
   * Clear the value of the field.
   */
  clear(): void;
}

export { InputMixin, InputMixinConstructor };
