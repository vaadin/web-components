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
import { ValidateMixinClass } from './validate-mixin.js';

/**
 * A mixin to combine multiple input validation constraints.
 */
export declare function InputConstraintsMixin<T extends Constructor<HTMLElement>>(
  base: T,
): T &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<InputConstraintsMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<ValidateMixinClass>;

export declare class InputConstraintsMixinClass {
  /**
   * Returns true if the current input value satisfies all constraints (if any).
   */
  checkValidity(): boolean;
}
