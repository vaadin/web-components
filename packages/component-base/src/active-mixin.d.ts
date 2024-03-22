/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from './disabled-mixin.js';
import type { KeyboardMixinClass } from './keyboard-mixin.js';

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
  base: T,
): Constructor<ActiveMixinClass> & Constructor<DisabledMixinClass> & Constructor<KeyboardMixinClass> & T;

export declare class ActiveMixinClass {
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
