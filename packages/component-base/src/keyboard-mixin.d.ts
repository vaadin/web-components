/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare class KeyboardHost {
  /**
   * A handler for the `keydown` event. By default, it does nothing.
   * Override the method to implement your own behavior.
   */
  protected _onKeyDown(event: KeyboardEvent): void;

  /**
   * A handler for the `keyup` event. By default, it does nothing.
   * Override the method to implement your own behavior.
   */
  protected _onKeyUp(event: KeyboardEvent): void;
}

/**
 * A mixin that manages keyboard handling.
 * The mixin subscribes to the keyboard events while an actual implementation
 * for the event handlers is left to the client (a component or another mixin).
 */
export declare function KeyboardMixin<T extends Constructor<HTMLElement>>(
  superclass: T
): T & Constructor<KeyboardHost> & Pick<typeof KeyboardHost, keyof typeof KeyboardHost>;
