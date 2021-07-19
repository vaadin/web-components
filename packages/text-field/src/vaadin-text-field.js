/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TextFieldMixin } from '@vaadin/field-base/src/text-field-mixin.js';
import '@vaadin/input-container/src/vaadin-input-container.js';
import './vaadin-input-field-shared-styles.js';

export class TextField extends TextFieldMixin(ThemableMixin(ElementMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-text-field';
  }

  static get version() {
    return '22.0.0-alpha0';
  }

  static get template() {
    return html`
      <style include="vaadin-input-field-shared-styles">
        [part='input-field'] {
          flex-grow: 0;
        }
      </style>

      <div part="container">
        <div part="label" on-click="focus">
          <slot name="label"></slot>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  constructor() {
    super();
    this._setType('text');
  }

  /** @protected */
  get clearElement() {
    return this.$.clearButton;
  }
}
