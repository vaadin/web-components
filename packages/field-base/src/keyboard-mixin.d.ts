/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * A mixin to listen to keyboard events, such as `keydown`, `keyup`.
 */
declare function KeyboardMixin<T extends new (...args: any[]) => {}>(base: T): T & KeyboardMixinConstructor;

interface KeyboardMixinConstructor {
  new (...args: any[]): KeyboardMixin;
}

interface KeyboardMixin {
  /**
   * A handler for the `keydown` event. By default, it does nothing.
   * Override the method to implement your own behavior.
   */
  _onKeyDown(_event: KeyboardEvent): void;

  /**
   * A handler for the `keyup` event. By default, it does nothing.
   * Override the method to implement your own behavior.
   */
  _onKeyUp(_event: KeyboardEvent): void;
}

export { KeyboardMixinConstructor, KeyboardMixin };
