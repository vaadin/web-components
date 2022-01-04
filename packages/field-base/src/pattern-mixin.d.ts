/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { DelegateStateMixinClass } from './delegate-state-mixin.js';
import { InputConstraintsMixinClass } from './input-constraints-mixin.js';
import { InputMixinClass } from './input-mixin.js';
import { ValidateMixinClass } from './validate-mixin.js';

/**
 * A mixin to provide `pattern` and `preventInvalidInput` properties.
 */
export declare function PatternMixin<T extends Constructor<HTMLElement>>(
  base: T
): T &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<InputConstraintsMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<PatternMixinClass> &
  Constructor<ValidateMixinClass>;

export declare class PatternMixinClass {
  /**
   * A regular expression that the value is checked against.
   * The pattern must match the entire value, not just some subset.
   */
  pattern: string;

  /**
   * When set to true, user is prevented from typing a value that
   * conflicts with the given `pattern`.
   * @attr {boolean} prevent-invalid-input
   */
  preventInvalidInput: boolean | null | undefined;
}
