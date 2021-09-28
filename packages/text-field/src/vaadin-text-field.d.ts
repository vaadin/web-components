/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { CharLengthMixin } from '@vaadin/field-base/src/char-length-mixin.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

declare class TextField extends InputFieldMixin(
  CharLengthMixin(PatternMixin(ThemableMixin(ElementMixin(HTMLElement))))
) {}

export { TextField };
