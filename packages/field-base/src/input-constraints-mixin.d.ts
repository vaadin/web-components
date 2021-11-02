/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { DelegateStateMixinClass } from './delegate-state-mixin.js';
import { InputMixinClass } from './input-mixin.js';
import { ValidateMixinClass } from './validate-mixin.js';

/**
 * A mixin to combine multiple input validation constraints.
 */
export declare function InputConstraintsMixin<T extends Constructor<HTMLElement>>(
  base: T
): T &
  Constructor<InputConstraintsMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<ValidateMixinClass>;

export declare class InputConstraintsMixinClass {
  /**
   * Returns true if the current input value satisfies all constraints (if any).
   */
  checkValidity(): boolean;
}
