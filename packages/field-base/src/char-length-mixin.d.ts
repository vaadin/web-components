/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InputConstraintsMixin } from './input-constraints-mixin.js';

/**
 * A mixin to provide `minlength` and `maxlength` properties
 * for components that use `<input>` or `<textarea>`.
 */
declare function CharLengthMixin<T extends new (...args: any[]) => {}>(base: T): T & CharLengthMixinConstructor;

interface CharLengthMixinConstructor {
  new (...args: any[]): CharLengthMixin;
}

interface CharLengthMixin extends InputConstraintsMixin {
  /**
   * Maximum number of characters (in Unicode code points) that the user can enter.
   */
  maxlength: number | null | undefined;

  /**
   * Minimum number of characters (in Unicode code points) that the user can enter.
   */
  minlength: number | null | undefined;
}

export { CharLengthMixin, CharLengthMixinConstructor };
