/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { formRowStyles } from './vaadin-form-layout-styles.js';

registerStyles('vaadin-form-row', formRowStyles, { moduleId: 'vaadin-form-row-styles' });

/**
 * `<vaadin-form-row>` is a web component for arranging fields into rows
 * inside a `<vaadin-form-layout>` that is set to autoResponsive mode.
 *
 * Each `<vaadin-form-row>` always starts on a new row. Fields that exceed
 * the available columns wrap to a new row, which then remains reserved
 * exclusively for the fields of that `<vaadin-form-row>` element.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 */
class FormRow extends ThemableMixin(PolymerElement) {
  static get is() {
    return 'vaadin-form-row';
  }

  static get template() {
    return html`<slot></slot>`;
  }
}

defineCustomElement(FormRow);

export { FormRow };
