/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin that manages keyboard handling.
 * The mixin subscribes to the keyboard events while an actual implementation
 * for the event handlers is left to the client (a component or another mixin).
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
  _onKeyDown(event: KeyboardEvent): void;

  /**
   * A handler for the `keyup` event. By default, it does nothing.
   * Override the method to implement your own behavior.
   */
  _onKeyUp(event: KeyboardEvent): void;
}

export { KeyboardMixinConstructor, KeyboardMixin };
