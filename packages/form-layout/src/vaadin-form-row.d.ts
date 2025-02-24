/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-form-row>` is a web component for arranging fields into rows
 * inside a `<vaadin-form-layout>` that is set to autoResponsive mode.
 *
 * Each `<vaadin-form-row>` always starts on a new row. Fields that exceed
 * the available columns wrap to a new row, which then remains reserved
 * exclusively for the fields of that `<vaadin-form-row>` element.
 */
declare class FormRow extends ThemableMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-form-row': FormRow;
  }
}

export { FormRow };
