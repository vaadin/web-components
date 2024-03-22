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
import type { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import type { DelegateStateMixinClass } from './delegate-state-mixin.js';
import type { InputMixinClass } from './input-mixin.js';

/**
 * A mixin to manage the checked state.
 */
export declare function CheckedMixin<T extends Constructor<object>>(
  base: T,
): Constructor<CheckedMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<InputMixinClass> &
  T;

export declare class CheckedMixinClass {
  /**
   * True if the element is checked.
   */
  checked: boolean;

  protected _toggleChecked(checked: boolean): void;
}
