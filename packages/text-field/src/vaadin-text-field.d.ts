/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base';
import { TextFieldMixin } from '@vaadin/field-base/src/text-field-mixin.js';
import { InputSlotMixin } from '@vaadin/field-base/src/input-slot-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

declare class TextField extends TextFieldMixin(InputSlotMixin(ThemableMixin(ElementMixin(HTMLElement)))) {}

export { TextField };
