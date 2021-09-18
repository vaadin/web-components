/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { InputSlotMixin } from '@vaadin/field-base/src/input-slot-mixin.js';
import { TextFieldMixin } from '@vaadin/field-base/src/text-field-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/input-container/src/vaadin-input-container.js';

registerStyles('vaadin-text-field', inputFieldShared, { moduleId: 'vaadin-text-field-styles' });

export class TextField extends TextFieldMixin(InputSlotMixin(ThemableMixin(ElementMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-text-field';
  }

  static get template() {
    return html`
      <style>
        [part='input-field'] {
          flex-grow: 0;
        }
      </style>

      <div part="container">
        <div part="label" on-click="focus">
          <slot name="label"></slot>
          <span part="indicator" aria-hidden="true"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[theme]]"
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
