/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { LabelMixin } from '@vaadin/field-base/src/label-mixin.js';
import { TextFieldMixin } from '@vaadin/field-base/src/text-field-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

declare class TextField extends TextFieldMixin(LabelMixin(ThemableMixin(ElementMixin(HTMLElement)))) {}

export { TextField };
