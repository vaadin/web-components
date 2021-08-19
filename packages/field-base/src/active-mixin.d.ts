/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from './disabled-mixin.js';

/**
 * A mixin to toggle the `active` attribute.
 *
 * The attribute is set whenever the user activates the element by a pointer
 * or presses an activation key on the element from the keyboard.
 *
 * The attribute is unset as soon as the element is deactivated
 * by the pointer or by releasing the activation key.
 */
declare function ActiveMixin<T extends new (...args: any[]) => {}>(base: T): T & ActiveMixinConstructor;

interface ActiveMixinConstructor {
  new (...args: any[]): ActiveMixin;
}

interface ActiveMixin extends DisabledMixin {}

export { ActiveMixinConstructor, ActiveMixin };
