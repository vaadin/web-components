/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { CharLengthMixin } from '@vaadin/field-base/src/char-length-mixin.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { TextAreaSlotMixin } from '@vaadin/field-base/src/text-area-slot-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

declare class TextArea extends CharLengthMixin(
  InputFieldMixin(TextAreaSlotMixin(ThemableMixin(ElementMixin(HTMLElement))))
) {}

export { TextArea };
