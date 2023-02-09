/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import type { InputMixinClass } from './input-mixin.js';

/**
 * A mixin that manages the clear button.
 */
export declare function ClearButtonMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ClearButtonMixinClass> & Constructor<InputMixinClass> & Constructor<KeyboardMixinClass> & T;

export declare class ClearButtonMixinClass {
  /**
   * Set to true to display the clear icon which clears the input.
   *
   * @attr {boolean} clear-button-visible
   */
  clearButtonVisible: boolean;
}
