/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InputConstraintsMixin } from './input-constraints-mixin.js';

/**
 * A mixin to provide `pattern` and `preventInvalidInput` properties.
 */
declare function PatternMixin<T extends new (...args: any[]) => {}>(base: T): T & PatternMixinConstructor;

interface PatternMixinConstructor {
  new (...args: any[]): PatternMixin;
}

interface PatternMixin extends InputConstraintsMixin {
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

export { PatternMixin, PatternMixinConstructor };
