/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to add event listeners to the input element.
 */
declare function InputListenersMixin<T extends new (...args: any[]) => {}>(base: T): T & InputListenersMixinConstructor;

interface InputListenersMixinConstructor {
  new (...args: any[]): InputListenersMixin;
}

interface InputListenersMixin {
  /**
   * A reference to the input element.
   * @type {!HTMLInputElement}
   */
  readonly inputElement: HTMLInputElement;
}

export { InputListenersMixin, InputListenersMixinConstructor };
