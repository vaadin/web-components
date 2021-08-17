/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { TextFieldMixin } from '@vaadin/field-base/src/text-field-mixin.js';
import { TextAreaSlotMixin } from '@vaadin/field-base/src/text-area-slot-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

declare class TextArea extends TextFieldMixin(TextAreaSlotMixin(ThemableMixin(ElementMixin(HTMLElement)))) {}

export { TextArea };
