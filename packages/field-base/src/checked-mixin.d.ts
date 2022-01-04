/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { DelegateStateMixinClass } from './delegate-state-mixin.js';
import { InputMixinClass } from './input-mixin.js';

/**
 * A mixin to manage the checked state.
 */
export declare function CheckedMixin<T extends Constructor<object>>(
  base: T
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
