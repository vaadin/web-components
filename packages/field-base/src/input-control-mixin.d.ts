/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { FieldMixin } from './field-mixin.js';
import { InputConstraintsMixin } from './input-constraints-mixin.js';

/**
 * A mixin to provide shared logic for the editable form input controls.
 */
declare function InputControlMixin<T extends new (...args: any[]) => {}>(base: T): T & InputControlMixinConstructor;

interface InputControlMixinConstructor {
  new (...args: any[]): InputControlMixin;
}

interface InputControlMixin extends KeyboardMixin, InputConstraintsMixin, FieldMixin {
  /**
   * If true, the input text gets fully selected when the field is focused using click or touch / tap.
   */
  autoselect: boolean;

  /**
   * Set to true to display the clear icon which clears the input.
   * @attr {boolean} clear-button-visible
   */
  clearButtonVisible: boolean;

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

export { InputControlMixin, InputControlMixinConstructor };
