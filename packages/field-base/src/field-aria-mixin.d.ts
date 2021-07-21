/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { HelperTextMixin } from './helper-text-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

/**
 * A mixin to handle field ARIA attributes based on the label, error message and helper text.
 */
declare function FieldAriaMixin<T extends new (...args: any[]) => {}>(base: T): T & FieldAriaMixinConstructor;

interface FieldAriaMixinConstructor {
  new (...args: any[]): FieldAriaMixin;
}

interface FieldAriaMixin extends HelperTextMixin, ValidateMixin {
  readonly _ariaTarget: HTMLElement;

  readonly _ariaAttr: string;
}

export { FieldAriaMixin, FieldAriaMixinConstructor };
