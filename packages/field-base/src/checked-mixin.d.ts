/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { DelegateStateMixinClass } from './delegate-state-mixin.js';
import { InputMixinClass } from './input-mixin.js';

/**
 * A mixin to manage the checked state.
 */
export declare function CheckedMixin<T extends Constructor<object>>(
  base: T,
): T &
  Constructor<CheckedMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<InputMixinClass>;

export declare class CheckedMixinClass {
  /**
   * True if the element is checked.
   */
  checked: boolean;

  protected _toggleChecked(checked: boolean): void;
}
