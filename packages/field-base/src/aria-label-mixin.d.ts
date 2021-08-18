/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LabelMixin } from './label-mixin.js';
import { InputMixin } from './input-mixin.js';

/**
 * A mixin to link an input element with a slotted `<label>` element.
 */
declare function AriaLabelMixin<T extends new (...args: any[]) => {}>(base: T): T & AriaLabelMixinConstructor;

interface AriaLabelMixinConstructor {
  new (...args: any[]): AriaLabelMixin;
}

interface AriaLabelMixin extends InputMixin, LabelMixin {}

export { AriaLabelMixin, AriaLabelMixinConstructor };
