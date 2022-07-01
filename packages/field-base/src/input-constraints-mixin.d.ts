/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import type { DelegateStateMixinClass } from './delegate-state-mixin.js';
import type { InputMixinClass } from './input-mixin.js';
import type { ValidateMixinClass } from './validate-mixin.js';

/**
 * A mixin to combine multiple input validation constraints.
 */
export declare function InputConstraintsMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<InputConstraintsMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class InputConstraintsMixinClass {
  /**
   * Returns true if the current input value satisfies all constraints (if any).
   */
  checkValidity(): boolean;
}
