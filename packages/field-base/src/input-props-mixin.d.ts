/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InputAriaMixin } from './input-aria-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

/**
 * A mixin to add `<input>` element to the corresponding named slot.
 */
declare function InputPropsMixin<T extends new (...args: any[]) => {}>(base: T): T & InputPropsMixinConstructor;

interface InputPropsMixinConstructor {
  new (...args: any[]): InputPropsMixin;
}

interface InputPropsMixin extends InputAriaMixin, ValidateMixin {
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

export { InputPropsMixinConstructor, InputPropsMixin };
