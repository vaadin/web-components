/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DelegateStateMixin } from './delegate-state-mixin.js';
import { InputMixin } from './input-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

/**
 * A mixin to combine multiple input validation constraints.
 */
declare function InputConstraintsMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & InputConstraintsMixinConstructor;

interface InputConstraintsMixinConstructor {
  new (...args: any[]): InputConstraintsMixin;
}

interface InputConstraintsMixin extends DelegateStateMixin, InputMixin, ValidateMixin {
  /**
   * Returns true if the current input value satisfies all constraints (if any).
   */
  checkValidity(): boolean;
}

export { InputConstraintsMixin, InputConstraintsMixinConstructor };
