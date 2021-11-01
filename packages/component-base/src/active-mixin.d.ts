/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledHost } from './disabled-mixin.js';
import { KeyboardHost } from './keyboard-mixin.js';

export declare class ActiveHost {
  /**
   * An array of activation keys.
   *
   * See possible values here:
   * https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key/Key_Values
   */
  protected readonly _activeKeys: string[];

  /**
   * Override to define if the component needs to be activated.
   */
  protected _shouldSetFocus(event: KeyboardEvent | MouseEvent): boolean;

  /**
   * Toggles the `active` attribute on the element.
   */
  protected _setActive(active: boolean): void;
}

/**
 * A mixin to toggle the `active` attribute.
 *
 * The attribute is set whenever the user activates the element by a pointer
 * or presses an activation key on the element from the keyboard.
 *
 * The attribute is removed as soon as the element is deactivated
 * by the pointer or by releasing the activation key.
 */
export declare function ActiveMixin<T extends Constructor<HTMLElement>>(
  superclass: T
): T &
  Constructor<ActiveHost> &
  Pick<typeof ActiveHost, keyof typeof ActiveHost> &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Constructor<KeyboardHost> &
  Pick<typeof KeyboardHost, keyof typeof KeyboardHost>;
