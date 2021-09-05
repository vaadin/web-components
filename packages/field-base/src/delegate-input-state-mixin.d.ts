/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InputMixin } from './input-mixin.js';
import { ValidateMixin } from './validate-mixin.js';
import { DelegateStateMixin } from './delegate-state-mixin.js';

/**
 * A mixin to forward properties to the input element.
 */
declare function DelegateInputStateMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & DelegateInputStateMixinConstructor;

interface DelegateInputStateMixinConstructor {
  new (...args: any[]): DelegateInputStateMixin;
}

interface DelegateInputStateMixin extends DelegateStateMixin, ValidateMixin, InputMixin {
  /**
   * The name of this field.
   */
  name: string;

  /**
   * A hint to the user of what can be entered in the field.
   */
  placeholder: string;

  /**
   * When present, it specifies that the field is read-only.
   */
  readonly: boolean;

  /**
   * The text usually displayed in a tooltip popup when the mouse is over the field.
   */
  title: string;
}

export { DelegateInputStateMixinConstructor, DelegateInputStateMixin };
